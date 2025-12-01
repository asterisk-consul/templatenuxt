// stores/articulos.ts
import { useExportData } from '@/composables/useExportData'
import { useImportArticulos } from '@/composables/useImportArticulos'
import { useTableColumns } from '@/composables/useTableColumns'

export const useArticulosStore = defineStore('articulos', () => {
  const rows = ref<RowArticulos[]>([])
  const cols = ref<string[]>([])
  const showableColumns = ref<string[]>([])
  const total = ref(0)
  const { exportCSV, exportExcel, exportJSON } = useExportData()

  // 🔎 Filtros reactivos
  const search = ref('')
  const filterFields = ref<string[]>([]) // campos que usa la búsqueda

  // 📌 UTable columns
  const { tableColumns } = useTableColumns<RowArticulos>(showableColumns, rows)

  const fetchArticulos = async () => {
    const data: ApiArticulos = await fetchData('/articulo/index')

    rows.value = data.rows
    cols.value = data.cols
    showableColumns.value = data.showableColumns
    total.value = data.total

    // Si no definís campos de filtro, usar todas las showableColumns
    if (filterFields.value.length === 0) {
      filterFields.value = [...data.showableColumns]
    }
  }

  const columnFilters = ref<Record<string, string[]>>({}) // { 'categoria': ['A', 'B'], 'marca': ['X'] }

  // 📌 Valores únicos por columna para los filtros
  const uniqueColumnValues = computed(() => {
    const values: Record<string, Set<string>> = {}

    // Inicializar sets para todas las columnas mostrables
    showableColumns.value.forEach((col) => {
      values[col] = new Set()
    })

    // Recorrer filas una sola vez
    rows.value.forEach((row) => {
      showableColumns.value.forEach((col) => {
        const val = row[col]
        if (val != null && val !== '') {
          values[col].add(String(val))
        }
      })
    })

    // Convertir a arrays ordenados
    const result: Record<string, string[]> = {}
    Object.keys(values).forEach((col) => {
      result[col] = Array.from(values[col]).sort()
    })

    return result
  })

  // 🎯 Filtrar filas por búsqueda global Y filtros de columna
  const filteredRows = computed(() => {
    let result = rows.value

    // 1. Aplicar filtros de columna
    const activeCols = Object.keys(columnFilters.value).filter(
      (col) => columnFilters.value[col]?.length > 0
    )

    if (activeCols.length > 0) {
      result = result.filter((row) => {
        return activeCols.every((col) => {
          const selectedValues = columnFilters.value[col]
          const rowValue = String(row[col] ?? '')
          return selectedValues.includes(rowValue)
        })
      })
    }

    // 2. Aplicar búsqueda global
    if (!search.value.trim()) return result

    const q = search.value.toLowerCase()

    return result.filter((row) =>
      filterFields.value.some((field) => {
        const value = row[field]
        return value && String(value).toLowerCase().includes(q)
      })
    )
  })
  const exportRows = computed(() => {
    return filteredRows.value.map((row) => {
      const plano: Record<string, any> = {}

      showableColumns.value.forEach((col) => {
        // Copio solo datos crudos y simples
        plano[col] = row[col] ?? null
      })

      return plano
    })
  })
  const importarArchivo = async (file: File) => {
    await fetchArticulos() // refresca tabla al terminar
  }

  const exportarCSV = () => exportCSV(filteredRows.value, 'articulos.csv')
  const exportarXLSX = () => exportExcel(filteredRows.value, 'articulos.xlsx')
  const exportarJSON = () => exportJSON(filteredRows.value, 'articulos.json')

  return {
    rows,
    cols,
    total,
    showableColumns,
    tableColumns,
    filteredRows,
    search,
    filterFields,
    columnFilters,
    uniqueColumnValues,
    fetchArticulos,
    exportarCSV,
    exportarXLSX,
    exportarJSON,
    exportRows,
    importarArchivo
  }
})

// Función para convertir "articulos.internalcode" → "Internalcode"
function normalizarLabel(key: string) {
  return (
    key
      .split('.')
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || key
  )
}
