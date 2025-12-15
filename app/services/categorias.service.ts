import { apiFetch } from '@/composables/useApi'
import type { Categoria } from '@/types/categorias'

export const CategoriasService = {
  findAll(): Promise<Categoria[]> {
    return apiFetch<Categoria[]>('/api/categorias', {
      api: 'api2'
    })
  },

  findByGrupos(grupos: string[]): Promise<Categoria[]> {
    return apiFetch<Categoria[]>('/api/categorias', {
      api: 'api2',
      query: { grupos }
    })
  },

  create(payload: Omit<Categoria, 'id'>): Promise<Categoria> {
    return apiFetch<Categoria>('/api/categorias', {
      api: 'api2',
      method: 'POST',
      body: payload
    })
  }
}
