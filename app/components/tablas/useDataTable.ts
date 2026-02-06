import { ref, computed, watch, type Ref } from 'vue'
import { adaptColumns } from './ColumnAdapter'
import type { DataTableColumn } from './types'

export function useDataTable(
  tableKey: string,
  rows: Ref<any[] | undefined>,
  backendColumns: Ref<DataTableColumn[] | undefined>
) {
  const data = ref<any[]>([])
  const allColumns = ref<DataTableColumn[]>([])

  watch(
    rows,
    (r) => {
      if (Array.isArray(r)) {
        data.value = [...r]
      } else {
        data.value = []
      }
    },
    { immediate: true }
  )

  watch(
    backendColumns,
    (cols) => {
      if (Array.isArray(cols)) {
        allColumns.value = adaptColumns(cols)
      } else {
        allColumns.value = []
      }
    },
    { immediate: true }
  )

  const visibleColumns = computed(() =>
    allColumns.value.filter((c) => getColumnMeta(c).visible !== false)
  )

  const toggleColumn = (key: string, visible: boolean) => {
    const col = allColumns.value.find((c) => c.id === key)
    if (!col) return

    getColumnMeta(col).visible = visible
    persist()
  }

  const reorderColumns = (from: number, to: number) => {
    if (from === to) return

    const cols = [...allColumns.value]
    const moved = cols[from]
    if (!moved) return

    cols.splice(from, 1)
    cols.splice(to, 0, moved)

    allColumns.value = cols
    persist()
  }

  const persist = () => {
    localStorage.setItem(
      `datatable:${tableKey}`,
      JSON.stringify(
        allColumns.value.map((c) => ({
          key: c.id,
          visible: getColumnMeta(c).visible !== false
        }))
      )
    )
  }

  return {
    data,
    allColumns,
    visibleColumns,
    toggleColumn,
    reorderColumns
  }
}

function getColumnMeta(col: any) {
  if (!col.meta) col.meta = {}
  return col.meta as {
    visible?: boolean
    type?: string
  }
}
