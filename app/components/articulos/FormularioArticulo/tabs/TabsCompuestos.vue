<script setup lang="ts">
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  useVueTable,
  FlexRender,
  type ExpandedState
} from '@tanstack/vue-table'
import { useDraggable, useDroppable } from '@vueuse/integrations/useDraggable'

interface Props {
  form: any
  disabled?: boolean
}

const props = defineProps<Props>()

const articulosStore = useArticulosStore()

// Estado
const expanded = ref<ExpandedState>({})
const data = ref<NodoListaMaestra[]>([])
const editingNode = ref<string | null>(null)

// Estado del modal
const modalAgregar = ref(false)
const modalEditar = ref(false)
const nodoPadre = ref<any>(null)
const nodoEditando = ref<any>(null)

// Form del modal agregar
const formAgregar = reactive({
  articuloId: null as number | null,
  cantidad: 1,
  ancho: null as number | null,
  largo: null as number | null,
  busqueda: ''
})

// Form del modal editar
const formEditar = reactive({
  cantidad: 1,
  ancho: null as number | null,
  largo: null as number | null
})

// Lista de artículos disponibles (cargar desde tu store)
const articulosDisponibles = ref<any[]>([])
const loadingArticulos = ref(false)
const searchTimeout = ref<NodeJS.Timeout>()

// Drag & Drop state
const draggedNode = ref<any>(null)
const dropTarget = ref<any>(null)

// Cargar datos
onMounted(async () => {
  await articulosStore.fetchListaMaestra(props.form.id)
  if (articulosStore.listaMaestra) {
    data.value = flattenTree([articulosStore.listaMaestra])
  }
})

// Función para aplanar el árbol
function flattenTree(
  nodes: NodoListaMaestra[],
  level = 0,
  parentId: string | null = null
): any[] {
  const result: any[] = []

  nodes.forEach((node) => {
    const nodeData = {
      ...node,
      level,
      parentId,
      uniqueId: `${node.id}-${level}-${parentId}`
    }

    result.push(nodeData)

    if (node.hijos && node.hijos.length > 0) {
      const children = flattenTree(node.hijos, level + 1, nodeData.uniqueId)
      result.push(...children)
    }
  })

  return result
}

// Buscar artículos
const buscarArticulos = async (query: string) => {
  if (!query || query.length < 2) {
    articulosDisponibles.value = []
    return
  }

  clearTimeout(searchTimeout.value)

  searchTimeout.value = setTimeout(async () => {
    loadingArticulos.value = true
    try {
      // Aquí llamas a tu API para buscar artículos
      const response = await articulosStore.fetchArticulos()

      // Filtrar por búsqueda
      articulosDisponibles.value = articulosStore.rows
        .filter(
          (art: any) =>
            art.nombre?.toLowerCase().includes(query.toLowerCase()) ||
            art.internalcode?.toLowerCase().includes(query.toLowerCase()) ||
            art.externalcode?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10) // Limitar a 10 resultados
    } finally {
      loadingArticulos.value = false
    }
  }, 300)
}

// Watch para búsqueda
watch(
  () => formAgregar.busqueda,
  (newVal) => {
    buscarArticulos(newVal)
  }
)

// Definir columnas
const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'drag',
    header: '',
    cell: ({ row }) => {
      if (props.disabled || row.original.level === 0) return null

      return h(
        'div',
        {
          class: 'cursor-move p-1 hover:bg-gray-200 rounded',
          draggable: true,
          onDragstart: (e: DragEvent) => handleDragStart(e, row.original),
          onDragend: handleDragEnd
        },
        '⋮⋮'
      )
    },
    size: 40
  }),

  columnHelper.display({
    id: 'expander',
    header: '',
    cell: ({ row }) => {
      if (row.original.hijos?.length > 0) {
        return h(
          'button',
          {
            onClick: row.getToggleExpandedHandler(),
            class: 'p-1 hover:bg-gray-100 rounded'
          },
          row.getIsExpanded() ? '▼' : '▶'
        )
      }
      return null
    },
    size: 50
  }),

  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: ({ row, getValue }) => {
      const level = row.original.level
      const indent = level * 24

      return h(
        'div',
        {
          class: 'flex items-center gap-2',
          style: { paddingLeft: `${indent}px` },
          onDragover: (e: DragEvent) => handleDragOver(e, row.original),
          onDragleave: handleDragLeave,
          onDrop: (e: DragEvent) => handleDrop(e, row.original)
        },
        [
          h(
            'span',
            {
              class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                level === 0
                  ? 'bg-purple-100 text-purple-800'
                  : level === 1
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`
            },
            level === 0 ? 'Epic' : level === 1 ? 'Story' : 'Task'
          ),
          h('span', { class: 'font-medium' }, getValue()),
          row.original.esTerminal &&
            h(
              'span',
              {
                class:
                  'text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded'
              },
              'Terminal'
            )
        ]
      )
    },
    size: 300
  }),

  columnHelper.accessor('internalcode', {
    header: 'Código',
    cell: ({ getValue }) =>
      h(
        'span',
        { class: 'text-gray-600 font-mono text-sm' },
        getValue() || '-'
      ),
    size: 120
  }),

  columnHelper.accessor('cantidad', {
    header: 'Cantidad',
    cell: ({ getValue, row }) => {
      if (editingNode.value === row.original.uniqueId) {
        return h('input', {
          type: 'number',
          value: getValue(),
          class:
            'w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500',
          onBlur: () => {
            editingNode.value = null
          },
          onChange: (e: Event) => {
            row.original.cantidad = Number((e.target as HTMLInputElement).value)
          }
        })
      }
      return h(
        'span',
        {
          class: 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded',
          onClick: () => {
            if (!props.disabled) {
              editingNode.value = row.original.uniqueId
            }
          }
        },
        getValue()?.toString() || '1'
      )
    },
    size: 100
  }),

  columnHelper.accessor('um', {
    header: 'UM',
    cell: ({ getValue }) =>
      h('span', { class: 'text-gray-600' }, getValue() || '-'),
    size: 80
  }),

  columnHelper.display({
    id: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const depositos = row.original.depositos || []
      const totalStock = depositos.reduce(
        (sum: number, d: any) => sum + (d.cantidad || 0),
        0
      )

      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          'span',
          {
            class: `font-semibold ${
              totalStock > 0 ? 'text-green-600' : 'text-red-600'
            }`
          },
          totalStock.toFixed(2)
        ),
        depositos.length > 0 &&
          h(
            'button',
            {
              class: 'text-xs text-blue-600 hover:underline',
              title: depositos
                .map((d: any) => `${d.deposito}: ${d.cantidad}`)
                .join('\n')
            },
            '📦'
          )
      ])
    },
    size: 120
  }),

  columnHelper.display({
    id: 'medidas',
    header: 'Medidas',
    cell: ({ row }) => {
      const { ancho, largo } = row.original
      if (!ancho && !largo) return h('span', { class: 'text-gray-400' }, '-')

      return h(
        'span',
        { class: 'text-sm text-gray-600' },
        `${ancho || '?'} × ${largo || '?'}`
      )
    },
    size: 100
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      if (props.disabled) return null

      return h('div', { class: 'flex items-center gap-1' }, [
        h(
          'button',
          {
            onClick: () => handleAddChild(row.original),
            class:
              'p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors',
            title: 'Agregar componente'
          },
          '➕'
        ),
        h(
          'button',
          {
            onClick: () => handleEdit(row.original),
            class:
              'p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors',
            title: 'Editar'
          },
          '✏️'
        ),
        row.original.level > 0 &&
          h(
            'button',
            {
              onClick: () => handleDelete(row.original),
              class:
                'p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors',
              title: 'Eliminar'
            },
            '🗑️'
          )
      ])
    },
    size: 120
  })
]

// Crear tabla
const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  state: {
    get expanded() {
      return expanded.value
    }
  },
  onExpandedChange: (updater) => {
    expanded.value =
      typeof updater === 'function' ? updater(expanded.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getSubRows: (row) => row.hijos
})

// Drag & Drop Handlers
const handleDragStart = (e: DragEvent, node: any) => {
  draggedNode.value = node
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget?.innerHTML || '')
  }
}

const handleDragEnd = () => {
  draggedNode.value = null
  dropTarget.value = null
}

const handleDragOver = (e: DragEvent, node: any) => {
  if (!draggedNode.value || draggedNode.value.uniqueId === node.uniqueId) return

  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dropTarget.value = node
}

const handleDragLeave = () => {
  dropTarget.value = null
}

const handleDrop = async (e: DragEvent, targetNode: any) => {
  e.preventDefault()

  if (!draggedNode.value || draggedNode.value.uniqueId === targetNode.uniqueId)
    return

  // Validar que no se arrastre un padre a su hijo
  if (isDescendant(targetNode, draggedNode.value)) {
    alert('No puedes mover un elemento a uno de sus descendientes')
    return
  }

  console.log('Mover:', draggedNode.value.nombre, '→', targetNode.nombre)

  // Aquí llamarías a tu API para actualizar la relación
  // await api.put(`/articulos-compuestos/${draggedNode.value.id}`, {
  //   parentarticuloid: targetNode.id
  // })

  // Recargar
  await articulosStore.fetchListaMaestra(props.form.id)
  if (articulosStore.listaMaestra) {
    data.value = flattenTree([articulosStore.listaMaestra])
  }

  draggedNode.value = null
  dropTarget.value = null
}

// Verificar si un nodo es descendiente de otro
const isDescendant = (parent: any, child: any): boolean => {
  let current = child
  while (current.parentId) {
    if (current.parentId === parent.uniqueId) return true
    current = data.value.find((n) => n.uniqueId === current.parentId)
    if (!current) break
  }
  return false
}

// Handlers
const handleAddChild = (node: any) => {
  nodoPadre.value = node
  formAgregar.articuloId = null
  formAgregar.cantidad = 1
  formAgregar.ancho = null
  formAgregar.largo = null
  formAgregar.busqueda = ''
  modalAgregar.value = true
}

const handleEdit = (node: any) => {
  nodoEditando.value = node
  formEditar.cantidad = node.cantidad
  formEditar.ancho = node.ancho
  formEditar.largo = node.largo
  modalEditar.value = true
}

const handleDelete = async (node: any) => {
  if (!confirm(`¿Eliminar ${node.nombre} de la estructura?`)) return

  try {
    // Llamar API para eliminar
    // await api.delete(`/articulos-compuestos/${node.id}`)

    // Recargar
    await articulosStore.fetchListaMaestra(props.form.id)
    if (articulosStore.listaMaestra) {
      data.value = flattenTree([articulosStore.listaMaestra])
    }
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}

const submitAgregar = async () => {
  if (!formAgregar.articuloId) {
    alert('Selecciona un artículo')
    return
  }

  try {
    // Llamar API para crear relación
    // await api.post('/articulos-compuestos', {
    //   parentarticuloid: nodoPadre.value.id,
    //   articuloid: formAgregar.articuloId,
    //   cantidad: formAgregar.cantidad,
    //   ancho: formAgregar.ancho,
    //   largo: formAgregar.largo,
    // })

    console.log('Agregando:', {
      padre: nodoPadre.value.nombre,
      hijo: formAgregar.articuloId,
      cantidad: formAgregar.cantidad
    })

    // Recargar
    await articulosStore.fetchListaMaestra(props.form.id)
    if (articulosStore.listaMaestra) {
      data.value = flattenTree([articulosStore.listaMaestra])
    }

    modalAgregar.value = false
  } catch (error) {
    console.error('Error al agregar:', error)
  }
}

const submitEditar = async () => {
  try {
    // Llamar API para actualizar
    // await api.put(`/articulos-compuestos/${nodoEditando.value.id}`, {
    //   cantidad: formEditar.cantidad,
    //   ancho: formEditar.ancho,
    //   largo: formEditar.largo,
    // })

    console.log('Editando:', nodoEditando.value.nombre, formEditar)

    // Recargar
    await articulosStore.fetchListaMaestra(props.form.id)
    if (articulosStore.listaMaestra) {
      data.value = flattenTree([articulosStore.listaMaestra])
    }

    modalEditar.value = false
  } catch (error) {
    console.error('Error al editar:', error)
  }
}

// Expandir/colapsar todos
const expandAll = () => {
  const allIds = data.value.reduce((acc, row, index) => {
    if (row.hijos?.length > 0) {
      acc[index] = true
    }
    return acc
  }, {} as ExpandedState)
  expanded.value = allIds
}

const collapseAll = () => {
  expanded.value = {}
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Estructura de Componentes</h2>
        <UBadge color="neutral" variant="subtle">
          {{ data.length }} items
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          size="sm"
          variant="ghost"
          icon="i-heroicons-chevron-double-down"
          @click="expandAll"
        >
          Expandir Todo
        </UButton>
        <UButton
          size="sm"
          variant="ghost"
          icon="i-heroicons-chevron-double-up"
          @click="collapseAll"
        >
          Colapsar Todo
        </UButton>
      </div>
    </div>

    <!-- Tabla -->
    <div class="border rounded-lg overflow-hidden bg-white">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                :style="{ width: `${header.getSize()}px` }"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="hover:bg-gray-50 transition-colors"
              :class="{
                'bg-purple-50': row.original.level === 0,
                'bg-blue-50': row.original.level === 1,
                'ring-2 ring-blue-500':
                  dropTarget?.uniqueId === row.original.uniqueId
              }"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-4 py-3 text-sm"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>

            <tr v-if="data.length === 0">
              <td
                :colspan="columns.length"
                class="px-4 py-12 text-center text-gray-500"
              >
                <div class="flex flex-col items-center gap-2">
                  <span class="text-4xl">📦</span>
                  <p>No hay componentes en la estructura</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="articulosStore.loadingListaMaestra"
      class="flex items-center justify-center py-12"
    >
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" />
    </div>

    <!-- Modal Agregar Componente -->
    <UModal v-model="modalAgregar">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              Agregar Componente a: {{ nodoPadre?.nombre }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="modalAgregar = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Buscador de artículos -->
          <UFormGroup label="Buscar Artículo" required>
            <UInput
              v-model="formAgregar.busqueda"
              placeholder="Código o nombre del artículo..."
              icon="i-heroicons-magnifying-glass"
            />
          </UFormGroup>

          <!-- Resultados de búsqueda -->
          <div v-if="loadingArticulos" class="text-center py-4">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
          </div>

          <div
            v-else-if="articulosDisponibles.length > 0"
            class="max-h-60 overflow-y-auto space-y-1 border rounded-lg p-2"
          >
            <div
              v-for="art in articulosDisponibles"
              :key="art.id"
              class="p-3 hover:bg-gray-50 rounded cursor-pointer border"
              :class="{
                'bg-blue-50 border-blue-500': formAgregar.articuloId === art.id
              }"
              @click="formAgregar.articuloId = art.id"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">{{ art.nombre }}</p>
                  <p class="text-sm text-gray-500">
                    {{ art.internalcode }} - {{ art.um }}
                  </p>
                </div>
                <UIcon
                  v-if="formAgregar.articuloId === art.id"
                  name="i-heroicons-check-circle"
                  class="text-blue-600 text-xl"
                />
              </div>
            </div>
          </div>

          <UDivider v-if="formAgregar.articuloId" />

          <!-- Datos adicionales -->
          <div v-if="formAgregar.articuloId" class="grid grid-cols-2 gap-4">
            <UFormGroup label="Cantidad" required>
              <UInput
                v-model.number="formAgregar.cantidad"
                type="number"
                min="0"
                step="0.01"
              />
            </UFormGroup>

            <UFormGroup label="Unidad de Medida">
              <UInput value="Heredada del artículo" disabled />
            </UFormGroup>

            <UFormGroup label="Ancho (opcional)">
              <UInput
                v-model.number="formAgregar.ancho"
                type="number"
                min="0"
                step="0.01"
                placeholder="mm"
              />
            </UFormGroup>

            <UFormGroup label="Largo (opcional)">
              <UInput
                v-model.number="formAgregar.largo"
                type="number"
                min="0"
                step="0.01"
                placeholder="mm"
              />
            </UFormGroup>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="modalAgregar = false"
            >
              Cancelar
            </UButton>
            <UButton :disabled="!formAgregar.articuloId" @click="submitAgregar">
              Agregar Componente
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Editar -->
    <UModal v-model="modalEditar">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              Editar: {{ nodoEditando?.nombre }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="modalEditar = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Cantidad" required>
            <UInput
              v-model.number="formEditar.cantidad"
              type="number"
              min="0"
              step="0.01"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Ancho (opcional)">
              <UInput
                v-model.number="formEditar.ancho"
                type="number"
                min="0"
                step="0.01"
                placeholder="mm"
              />
            </UFormGroup>

            <UFormGroup label="Largo (opcional)">
              <UInput
                v-model.number="formEditar.largo"
                type="number"
                min="0"
                step="0.01"
                placeholder="mm"
              />
            </UFormGroup>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="modalEditar = false"
            >
              Cancelar
            </UButton>
            <UButton @click="submitEditar">Guardar Cambios</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

[draggable='true'] {
  cursor: move;
}
</style>
