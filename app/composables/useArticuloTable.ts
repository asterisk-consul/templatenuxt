// composables/useArticulosTable.ts
import { useTableColumns } from '@/composables/useTableColumns'

export function useArticulosTable(
  rows: Ref<RowArticulos[]>,
  showableColumns: Ref<Array<keyof RowArticulos>>
) {
  const search = ref('')
  const filterFields = ref<string[]>([])
  const columnFilters = ref<Record<string, string[]>>({})

  // columnas UTable
  const { tableColumns } = useTableColumns<RowArticulos>(showableColumns, rows)

  // valores únicos por columna

  const uniqueColumnValues = computed(() => {
    const sets: Record<string, Set<string>> = {}

    showableColumns.value.forEach((col) => {
      sets[col] = new Set<string>()
    })

    rows.value.forEach((row) => {
      showableColumns.value.forEach((col) => {
        const val = row[col]
        if (val != null && val !== '') {
          sets[col]?.add(String(val))
        }
      })
    })

    const out: Record<string, string[]> = {}

    // Solución 1: Usando for...in con verificación
    for (const col in sets) {
      if (Object.prototype.hasOwnProperty.call(sets, col)) {
        const set = sets[col]
        if (set) {
          out[col] = Array.from(set).sort()
        }
      }
    }

    return out
  })
  // Filtrado global + por columnas
  const filteredRows = computed(() => {
    let result = [...rows.value]

    // 1. filtros por columnas
    const activeCols = Object.keys(columnFilters.value).filter(
      (col) => columnFilters.value[col]?.length
    )

    if (activeCols.length) {
      result = result.filter((row) =>
        activeCols.every((col) => {
          const key = col as keyof RowArticulos
          const selected = columnFilters.value[col] ?? []
          const val = String(row[key] ?? '')
          return selected.includes(val)
        })
      )
    }

    // 2. búsqueda global
    const q = search.value.trim().toLowerCase()
    if (!q) return result

    return result.filter((row) =>
      filterFields.value.some((field) => {
        const val = row[field as keyof RowArticulos]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  })

  // export
  const exportRows = computed(() =>
    filteredRows.value.map((row) => {
      const plano: Record<string, any> = {}
      showableColumns.value.forEach((col) => {
        plano[col] = row[col as keyof RowArticulos] ?? null
      })
      return plano
    })
  )

  return {
    tableColumns,
    search,
    filterFields,
    columnFilters,
    uniqueColumnValues,
    filteredRows,
    exportRows
  }
}
