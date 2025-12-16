// stores/articulos.ts
import { ArticulosService } from '@/services/articulosApi'

export const useArticulosStore = defineStore('articulos', () => {
  // ============================================
  // ESTADO: Lista de artículos (tabla principal)
  // ============================================
  const rows = ref<RowArticulos[]>([]) // Lista de artículos
  const cols = ref<string[]>([]) // Columnas que se mostrarán
  const showableColumns = ref<string[]>([]) // Columnas visibles
  const total = ref(0) // Total de artículos
  const loading = ref(false) // Estado de carga para la lista

  // ============================================
  // ESTADO: Artículo individual (vista detalle)
  // ============================================
  const articulos = ref<Record<string, Partial<ArticulosApiN>>>({})
  const articuloActual = ref<Partial<ArticulosApiN> | null>(null) // Artículo seleccionado
  const loadingDetalle = ref<Record<string, boolean>>({})
  const loading2 = ref(false)

  // ============================================
  // ESTADO: BOM / Árbol de costos
  // ============================================
  const arbolCostos = ref<ArbolCostosNodo | null>(null) // Árbol de costos
  const loadingBom = ref(false) // Estado de carga para el BOM (árbol de materiales)

  // ============================================
  // ESTADO: Lista Maestra (estructura completa)
  // ============================================
  const listaMaestra = ref<NodoListaMaestra[]>([]) // Lista maestra completa
  const loadingListaMaestra = ref(false) // Estado de carga para la lista maestra

  // ============================================
  // ACTIONS (Acciones que modifican el estado)
  // ============================================

  // GET ALL - Para la tabla principal (lista de artículos)
  const fetchArticulos = async () => {
    loading.value = true
    try {
      const data = await ArticulosService.apiGetArticulos()
      rows.value = data.rows
      cols.value = data.cols
      showableColumns.value = data.showableColumns as (keyof RowArticulos)[] // Columns visibles
      total.value = data.total // Total de artículos
    } finally {
      loading.value = false
    }
  }

  const fetchArticuloById = async (
    id: string
  ): Promise<Partial<ArticulosApiN> | null> => {
    loading2.value = true
    try {
      const result = await ArticulosService.apiGetArticuloById(id)
      articuloActual.value = result ?? null
      return articuloActual.value
    } finally {
      loading2.value = false
    }
  }

  // GET BY ID - Para vista de detalle de un artículo
  const fetchArticuloGroupById = async (
    id: string
  ): Promise<Partial<ArticulosApiN> | null> => {
    // Check cache first
    if (articulos.value[id]) {
      return articulos.value[id] ?? null
    }

    loadingDetalle.value[id] = true

    try {
      const result = await ArticulosService.apiGetArticuloById(id)

      // Ensure we always return null instead of undefined
      const article = result ?? null
      articulos.value[id] = article

      return article
    } finally {
      loadingDetalle.value[id] = false
    }
  }

  // GET BOM - Para análisis de costos (árbol de materiales)
  const fetchArbolCostos = async (id: number) => {
    loadingBom.value = true
    try {
      const result = await ArticulosService.apiGetArticuloBom(id)
      console.log('result', result)
      arbolCostos.value = result ?? null // Asigna el árbol de costos
    } finally {
      loadingBom.value = false
    }
  }

  // GET LISTA MAESTRA - Para vista Jira-style (estructura completa)
  const fetchListaMaestra = async (id: string) => {
    loadingListaMaestra.value = true
    try {
      const result = await ArticulosService.apiGetListaMaestra(id)
      listaMaestra.value = result // <-- esto es lo que te faltaba
    } finally {
      loadingListaMaestra.value = false
    }
  }

  // ============================================
  // GETTERS (Propiedades calculadas útiles)
  // ============================================

  const tieneHijos = computed(() => {
    return listaMaestra.value?.some((item) => item.hijos?.length > 0) // Verifica si tiene hijos
  })

  const tienePadres = computed(() => {
    return (articuloActual.value?.articulos_padre?.length ?? 0) > 0 // Verifica si tiene padres
  })

  const esArticuloCompuesto = computed(() => {
    return tieneHijos.value || tienePadres.value // Verifica si es un artículo compuesto
  })

  // ============================================
  // RESET FUNCTIONS (Función de reset)
  // ============================================

  const resetDetalle = () => {
    articuloActual.value = null // Resetea el detalle del artículo
  }

  const resetListaMaestra = () => {
    listaMaestra.value = [] // Resetea la lista maestra
  }

  const resetArbolCostos = () => {
    arbolCostos.value = null // Resetea el árbol de costos
  }

  return {
    // Estado de lista principal
    rows,
    cols,
    total,
    showableColumns,
    loading,

    // Estado de detalle
    articulos,
    articuloActual,
    loadingDetalle,

    // Estado de BOM / Árbol de costos
    arbolCostos,
    loadingBom,

    // Estado de lista maestra
    listaMaestra,
    loadingListaMaestra,

    // Acciones
    fetchArticulos,
    fetchArticuloById,
    fetchArticuloGroupById,
    fetchArbolCostos,
    fetchListaMaestra,

    // Getters
    tieneHijos,
    tienePadres,
    esArticuloCompuesto,

    // Funciones de reset
    resetDetalle,
    resetListaMaestra,
    resetArbolCostos
  }
})
