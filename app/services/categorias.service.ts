import { apiFetch } from '@/composables/useApi'
import type { Categoria } from '@/types/categorias'

export const CategoriasService = {
  findAll(): Promise<Categoria[]> {
    return apiFetch<Categoria[]>('/api/categorias', {
      api: 'api2'
    })
  },

  findByGrupos(grupo: string[]): Promise<Categoria[]> {
    return apiFetch<Categoria[]>('/api/categorias', {
      api: 'api2',
      query: { grupo }
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
