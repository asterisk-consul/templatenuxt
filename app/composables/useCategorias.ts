import { storeToRefs } from 'pinia'
import { useCategoriasStore } from '@/stores/categorias.store'
import type { Categoria } from '@/types/categorias'

export function useCategorias() {
  const store = useCategoriasStore()
  const { entities, loading } = storeToRefs(store)

  function load(grupos?: string[]) {
    if (loading.value) return
    return grupos?.length ? store.fetchByGrupos(grupos) : store.fetchAll()
  }

  const byId = computed<Record<string, Categoria>>(() =>
    Object.fromEntries(entities.value.map((c) => [c.id, c]))
  )

  function resolveNombre(id?: string | null): string {
    return id ? (byId.value[id]?.name ?? '-') : '-'
  }

  const selectOptions = computed(() =>
    entities.value.map((c) => ({
      label: c.name,
      value: c.id
    }))
  )

  function findById(id: string) {
    return byId.value[id]
  }

  return {
    loading,
    load,
    selectOptions,
    resolveNombre,
    findById
  }
}
