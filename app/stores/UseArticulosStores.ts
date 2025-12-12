// stores/articulos.ts
import { ArticuloEditSchema } from '@/schemas/ArticuloApiSchema'

export const useArticulosStore = defineStore('articulos', () => {
  const rows = ref<RowArticulos[]>([])
  const cols = ref<string[]>([])
  const showableColumns = ref<(keyof RowArticulos)[]>([])

  const total = ref(0)
  const articuloEdit = ref<Partial<ArticulosApiN>>({})
  const loading = ref(false)

  const fetchArticulos = async () => {
    loading.value = true

    const { value: data } =
      (await fetchData<ApiArticulos>('/articulo/index', { api: 'api1' })) ?? {}

    if (!data) throw new Error('Sin datos')

    rows.value = data.rows
    cols.value = data.cols
    showableColumns.value = data.showableColumns as (keyof RowArticulos)[]
    total.value = data.total

    loading.value = false
  }

  const fetchArticuloById = async (id: string) => {
    loading.value = true

    const data: DataApi = await fetchData(`/articulos/${id}`, { api: 'api2' })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    articuloEdit.value = parsed.success ? data.value : {}

    loading.value = false
  }

  const fetchArticuloBom = async (id: string) => {
    loading.value = true

    const data: DataApi = await fetchData(`/articulos/bom/${id}`, {
      api: 'api2'
    })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    articuloEdit.value = parsed.success ? data.value : {}

    loading.value = false
  }

  return {
    rows,
    cols,
    total,
    showableColumns,
    articuloEdit,
    loading,
    fetchArticulos,
    fetchArticuloById,
    fetchArticuloBom
  }
})
