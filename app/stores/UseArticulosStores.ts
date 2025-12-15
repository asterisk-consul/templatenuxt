// stores/articulos.ts
import { ArticulosService } from '@/services/articulosApi'

export const useArticulosStore = defineStore('articulos', () => {
  // ============================================
  // ESTADO: Lista de artículos (tabla principal)
  // ============================================
  const rows = ref<RowArticulos[]>([])
  const cols = ref<string[]>([])
  const showableColumns = ref<string[]>([])
  const total = ref(0)
  const loading = ref(false)

  // ============================================
  // ESTADO: Artículo individual (vista detalle)
  // ============================================
  const articuloActual = ref<Partial<ArticulosApiN> | null>(null)
  const loadingDetalle = ref(false)

  // ============================================
  // ESTADO: BOM / Árbol de costos
  // ============================================
  const arbolCostos = ref<ArbolCostosNodo | null>(null)
  const loadingBom = ref(false)

  // ============================================
  // ESTADO: Lista Maestra (estructura completa)
  // ============================================
  const listaMaestra = ref<NodoListaMaestra | null>(null)
  const loadingListaMaestra = ref(false)

  // ============================================
  // ACTIONS
  // ============================================

  // GET ALL - Para la tabla principal
  const fetchArticulos = async () => {
    loading.value = true
    try {
      const data = await ArticulosService.apiGetArticulos()
      rows.value = data.rows
      cols.value = data.cols
      showableColumns.value = data.showableColumns as (keyof RowArticulos)[]
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // GET BY ID - Para vista de detalle
  const fetchArticuloById = async (id: string) => {
    loadingDetalle.value = true
    try {
      const result = await ArticulosService.apiGetArticuloById(id)
      articuloActual.value = result ?? null
    } finally {
      loadingDetalle.value = false
    }
  }

  // GET BOM - Para análisis de costos
  const fetchArbolCostos = async (id: number) => {
    loadingBom.value = true
    try {
      const result = await ArticulosService.apiGetArticuloBom(id)
      arbolCostos.value = result ?? null
    } finally {
      loadingBom.value = false
    }
  }

  // GET LISTA MAESTRA - Para vista Jira-style
  const fetchListaMaestra = async (id: number) => {
    loadingListaMaestra.value = true
    try {
      const result = await ArticulosService.apiGetListaMaestra(id)
      listaMaestra.value = result ?? null
    } finally {
      loadingListaMaestra.value = false
    }
  }

  // ============================================
  // GETTERS (opcionales pero útiles)
  // ============================================
  const tieneHijos = computed(() => {
    return listaMaestra.value?.hijos && listaMaestra.value.hijos.length > 0
  })

  const tienePadres = computed(() => {
    return (articuloActual.value?.articulos_padre?.length ?? 0) > 0
  })
  const esArticuloCompuesto = computed(() => {
    return tieneHijos.value || tienePadres.value
  })

  // ============================================
  // RESET FUNCTIONS (buena práctica)
  // ============================================
  const resetDetalle = () => {
    articuloActual.value = null
  }

  const resetListaMaestra = () => {
    listaMaestra.value = null
  }

  const resetArbolCostos = () => {
    arbolCostos.value = null
  }

  return {
    // Estado de lista
    rows,
    cols,
    total,
    showableColumns,
    loading,

    // Estado de detalle
    articuloActual,
    loadingDetalle,

    // Estado de BOM
    arbolCostos,
    loadingBom,

    // Estado de lista maestra
    listaMaestra,
    loadingListaMaestra,

    // Actions
    fetchArticulos,
    fetchArticuloById,
    fetchArbolCostos,
    fetchListaMaestra,

    // Getters
    tieneHijos,
    tienePadres,
    esArticuloCompuesto,

    // Reset
    resetDetalle,
    resetListaMaestra,
    resetArbolCostos
  }
})
