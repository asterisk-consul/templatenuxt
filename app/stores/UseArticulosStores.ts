// stores/articulos.ts
import { useTableColumns } from '@/composables/useTableColumns'
import { ArticuloEditSchema } from '@/schemas/ArticuloApiSchema'

export const useArticulosStore = defineStore('articulos', () => {
  const rows = ref<RowArticulos[]>([])
  const cols = ref<string[]>([])
  const showableColumns = ref<string[]>([])
  const total = ref(0)
  const articuloEdit = ref<Partial<ArticulosApiN>>({})
  const loading = ref(false)

  // 🔎 Filtros reactivos
  const search = ref('')
  const filterFields = ref<string[]>([]) // campos que usa la búsqueda

  // 📌 UTable columns
  const { tableColumns } = useTableColumns<RowArticulos>(showableColumns, rows)

  const fetchArticulos = async () => {
    loading.value = true

    const { value: data } =
      (await fetchData<ApiArticulos>('/articulo/index', {
        api: 'api1'
      })) ?? {}

    if (!data) {
      throw new Error('Sin datos')
    }

    rows.value = data.rows
    cols.value = data.cols
    showableColumns.value = data.showableColumns
    total.value = data.total

    if (filterFields.value.length === 0) {
      filterFields.value = [...data.showableColumns]
    }

    loading.value = false
  }

  const fetchArticuloById = async (id: string) => {
    loading.value = true
    const data: DataApi = await fetchData(`/articulos/${id}`, { api: 'api2' })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    if (parsed.success) {
      articuloEdit.value = data.value
    } else {
      console.error('Datos inválidos del artículo:', parsed.error)
      articuloEdit.value = {}
    }

    loading.value = false
  }
  const fetchArticuloBom = async (id: string) => {
    loading.value = true
    const data: DataApi = await fetchData(`/articulos/bom/${id}`, {
      api: 'api2'
    })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    if (parsed.success) {
      articuloEdit.value = data.value
    } else {
      console.error('Datos inválidos del artículo:', parsed.error)
      articuloEdit.value = {}
    }

    loading.value = false
  }

  const columnFilters = ref<Record<string, string[]>>({}) // { 'categoria': ['A', 'B'], 'marca': ['X'] }

  // 📌 Valores únicos por columna para los filtros
  const uniqueColumnValues = computed(() => {
    const values: Record<string, Set<string>> = {}

    // Inicializar sets para todas las columnas mostrables
    showableColumns.value.forEach((col) => {
      values[col] = new Set()
    })

    // Recorrer filas
    rows.value.forEach((row) => {
      showableColumns.value.forEach((col) => {
        const key = col as keyof RowArticulos
        const val = row[key]
        if (val != null && val !== '') {
          values[col]!.add(String(val)) // <-- el '!' indica que no es undefined
        }
      })
    })

    // Convertir a arrays ordenados
    const result: Record<string, string[]> = {}
    Object.keys(values).forEach((col) => {
      result[col] = Array.from(values[col]!).sort() // <-- '!' nuevamente
    })

    return result
  })

  // 🎯 Filtrar filas por búsqueda global Y filtros de columna
  const filteredRows = computed(() => {
    let result = rows.value

    // 1. Aplicar filtros de columna
    const activeCols = Object.keys(columnFilters.value).filter(
      (col) => (columnFilters.value[col] ?? []).length > 0
    )

    if (activeCols.length > 0) {
      result = result.filter((row) => {
        return activeCols.every((col) => {
          const key = col as keyof RowArticulos
          const selectedValues = columnFilters.value[col] ?? []
          const rowValue = String(row[key] ?? '')
          return selectedValues.includes(rowValue)
        })
      })
    }

    // 2. Aplicar búsqueda global
    if (!search.value.trim()) return result

    const q = search.value.toLowerCase()

    return result.filter((row) =>
      filterFields.value.some((field) => {
        const fieldKey = field as keyof RowArticulos
        const value = row[fieldKey]
        return value != null && String(value).toLowerCase().includes(q)
      })
    )
  })

  const exportRows = computed(() => {
    return filteredRows.value.map((row) => {
      const plano: Record<string, any> = {}

      showableColumns.value.forEach((col) => {
        const key = col as keyof RowArticulos // <-- le decimos a TS que col es una propiedad
        plano[col] = row[key] ?? null
      })

      return plano
    })
  })

  return {
    rows,
    cols,
    total,
    showableColumns,
    tableColumns,
    filteredRows,
    loading,
    search,
    filterFields,
    columnFilters,
    uniqueColumnValues,
    fetchArticulos,
    fetchArticuloById,
    articuloEdit,
    exportRows
  }
})
