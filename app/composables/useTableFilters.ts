// composables/useTableFilters.ts

interface UseTableFiltersOptions<T> {
  data: Ref<T[]>
  columns: Ref<string[]>
  searchFields?: Ref<string[]> | string[]
}

/**
 * Maneja búsqueda global y filtros por columna
 */
export function useTableFilters<T extends Record<string, any>>(
  options: UseTableFiltersOptions<T>
) {
  const { data, columns, searchFields } = options

  // Estado de filtros
  const search = ref('')
  const columnFilters = ref<Record<string, string[]>>({})

  // Campos donde buscar (default: todas las columnas)
  const filterFields = computed(() => {
    if (searchFields) {
      return isRef(searchFields) ? searchFields.value : searchFields
    }
    return columns.value
  })

  /**
   * Valores únicos por columna (para dropdowns)
   */
  const uniqueColumnValues = computed(() => {
    const values: Record<string, Set<string>> = {}

    // Inicializar
    columns.value.forEach((col) => {
      values[col] = new Set()
    })

    // Recolectar valores únicos
    data.value.forEach((row) => {
      columns.value.forEach((col) => {
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

  /**
   * Datos filtrados (columnas + búsqueda)
   */
  const filteredData = computed(() => {
    let result = data.value

    // 1️⃣ Filtros por columna
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

    // 2️⃣ Búsqueda global
    if (!search.value.trim()) return result

    const query = search.value.toLowerCase()

    return result.filter((row) =>
      filterFields.value.some((field) => {
        const value = row[field]
        return value && String(value).toLowerCase().includes(query)
      })
    )
  })

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    search.value = ''
    columnFilters.value = {}
  }

  /**
   * Limpia filtro de una columna específica
   */
  const clearColumnFilter = (column: string) => {
    delete columnFilters.value[column]
  }

  return {
    // Estado
    search,
    columnFilters,
    filterFields,

    // Computados
    uniqueColumnValues,
    filteredData,

    // Acciones
    clearFilters,
    clearColumnFilter
  }
}
