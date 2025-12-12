import { fetchData } from '@/composables/apiService'
import { ArticuloEditSchema } from '@/schemas/ArticuloApiSchema'

export async function apiGetArticulos() {
  const { value } =
    (await fetchData<ApiArticulos>('/articulo/index', { api: 'api1' })) ?? {}

  if (!value) throw new Error('Sin datos')
  return value
}

export async function apiGetArticuloById(id: string) {
  const data: DataApi = await fetchData(`/articulos/${id}`, { api: 'api2' })

  const parsed = ArticuloEditSchema.safeParse(data.value)
  return parsed.success ? data.value : null
}

export async function apiGetArticuloBom(id: string) {
  const data: DataApi = await fetchData(`/articulos/bom/${id}`, {
    api: 'api2'
  })

  const parsed = ArticuloEditSchema.safeParse(data.value)
  return parsed.success ? data.value : null
}
