// stores/articulos/state.ts

export const rows = ref<RowArticulos[]>([])
export const cols = ref<string[]>([])
export const showableColumns = ref<string[]>([])
export const total = ref(0)

// búsqueda global
export const search = ref('')
export const filterFields = ref<string[]>([])

// filtros por columna (selects)
export const columnFilters = ref<Record<string, string[]>>({})
