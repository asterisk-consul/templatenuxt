import { ref, computed, watch } from 'vue'
import { adaptColumns } from './ColumnAdapter'
import type { DataTableColumn } from './types'

export function useDataTable(
  tableKey: string,
  rows: any[],
  backendColumns: DataTableColumn[]
) {
  const data = ref([...rows])
  const allColumns = ref(adaptColumns(backendColumns))

  watch(
    () => rows,
    (r) => (data.value = [...r]),
    { deep: true }
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
