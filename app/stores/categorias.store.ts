import { defineStore } from 'pinia'
import type { Categoria } from '@/types/categorias'
import { CategoriasService } from '@/services/categorias.service'

export const useCategoriasStore = defineStore('categorias', () => {
  const entities = ref<Categoria[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchAll() {
    if (loaded.value) return
    loading.value = true
    entities.value = await CategoriasService.findAll()
    loaded.value = true
    loading.value = false
  }

  async function fetchByGrupos(grupos: string[]) {
    loading.value = true
    entities.value = await CategoriasService.findByGrupos(grupos)
    loading.value = false
  }

  return {
    entities,
    loading,
    fetchAll,
    fetchByGrupos
  }
})
