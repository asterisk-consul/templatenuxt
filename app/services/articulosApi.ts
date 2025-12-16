import { fetchData } from '@/composables/apiService'
import { adaptListaMaestra } from '@/adapters/listaMaestra.adapter'
import { ArticuloEditSchema } from '@/schemas/ArticuloApiSchema'

export const ArticulosService = {
  async apiGetArticulos() {
    const { value } =
      (await fetchData<ApiArticulos>('/articulo/index', { api: 'api1' })) ?? {}

    if (!value) throw new Error('Sin datos')
    return value
  },
  async apiGetArticuloById(id: string) {
    const data: DataApi = await fetchData(`/api/articulos/${id}`, {
      api: 'api2'
    })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    return parsed.success ? data.value : null
  },
  async apiGetArticuloBom(id: number) {
    const data: DataApi = await fetchData(`/api/articulos/bom/${id}`, {
      api: 'api2'
    })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    return parsed.success ? data.value : null
  },
  async apiGetListaMaestra(id: string) {
    const data: DataApi = await fetchData(`/api/articulos/compuestos/${id}`, {
      api: 'api2'
    })

    const parsed = ArticuloEditSchema.safeParse(data.value)
    return parsed.success ? adaptListaMaestra(data.value) : null
  }

  // async create(data: Partial<Articulo>): Promise<Articulo> {
  //   const res = await fetch(`/articulos`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  //   })
  //   if (!res.ok) throw new Error('Error al crear artículo')
  //   return res.json()
  // },

  // async update(id: number, data: Partial<Articulo>): Promise<Articulo> {
  //   const res = await fetch(`/articulos/${id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  //   })
  //   if (!res.ok) throw new Error('Error al actualizar artículo')
  //   return res.json()
  // },

  // async delete(id: number): Promise<void> {
  //   const res = await fetch(`/articulos/${id}`, { method: 'DELETE' })
  //   if (!res.ok) throw new Error('Error al eliminar artículo')
  // }
}
