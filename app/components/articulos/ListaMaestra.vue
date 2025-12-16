<script setup lang="ts">
import { ref, watch, h, resolveComponent } from 'vue'
import type { CellContext } from '@tanstack/vue-table'
const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')
import type { TableColumn } from '@nuxt/ui'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

// ==========================================================
// Tipos
// ==========================================================
type NodoArbol = {
  id: string | number
  internalcode: string | null
  externalcode: string | null
  nombre: string
  cantidad: number
  ancho?: number | null
  largo?: number | null
  articulo?: any
  hijos: NodoArbol[]

  depth?: number
  parentId?: string | number | null
}

// ==========================================================
// Props
// ==========================================================
const props = defineProps<{ data: NodoArbol }>()

// ==========================================================
// Estados
// ==========================================================
const flatData = ref<NodoArbol[]>([])
const expanded = ref<Set<string | number>>(new Set())
const rowSelection = ref<Record<string, boolean>>({})
const table = useTemplateRef('table')

// ==========================================================
// Flatten tree
// ==========================================================
function flatten(
  node: NodoArbol,
  depth = 0,
  parentId: string | number | null = null
) {
  const copy = { ...node, depth, parentId }
  flatData.value.push(copy)

  if (expanded.value.has(node.id)) {
    for (const child of node.hijos) {
      flatten(child, depth + 1, node.id)
    }
  }
}

function rebuild() {
  flatData.value = []
  flatten(props.data)
}

rebuild()

watch(expanded, rebuild, { deep: true })
watch(() => props.data, rebuild, { deep: true })

// ==========================================================
// Toggle
// ==========================================================
function toggle(id: string | number) {
  if (expanded.value.has(id)) {
    expanded.value = new Set([...expanded.value].filter((i) => i !== id))
  } else {
    expanded.value = new Set([...expanded.value, id])
  }
}

// ==========================================================
// Helpers
// ==========================================================
function esTerminal(code: string | null | undefined) {
  return !!code && code.trim().startsWith('T')
}

// ==========================================================
// Drag & Drop
// ==========================================================
function onMove(evt: any) {
  const dragged = evt.draggedContext.element
  const target = evt.relatedContext.element

  // No mover raíz
  if (!dragged.parentId) return false

  // No permitir mover dentro de sí mismo
  let current = target
  while (current) {
    if (current.id === dragged.id) return false
    current = current.parentId
      ? flatData.value.find((n) => n.id === current.parentId)
      : null
  }

  return true
}

function onDragChange(evt: any) {
  console.log('Nuevo orden:', evt)
}

// ==========================================================
// Columnas
// ==========================================================
const columns: TableColumn<NodoArbol, unknown>[] = [
  // Selección de fila
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: Object.values(rowSelection.value).some(Boolean)
          ? 'indeterminate'
          : Object.values(rowSelection.value).every(Boolean),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          flatData.value.forEach((item) => {
            rowSelection.value[item.id] = !!value
          })
        },
        'aria-label': 'Select all'
      }),
    cell: ({ row }: CellContext<NodoArbol, unknown>) =>
      h(UCheckbox, {
        modelValue: !!rowSelection.value[row.original.id],
        'onUpdate:modelValue': (value: boolean) => {
          rowSelection.value[row.original.id] = value
        },
        'aria-label': 'Select row'
      })
  },

  // Nombre con drag handle y expand/collapse
  {
    accessorKey: 'nombre',
    header: 'Artículo',
    cell: ({ row }: CellContext<NodoArbol, unknown>) => {
      const item = row.original
      const isTerminal = esTerminal(item.internalcode)

      return h(
        'div',
        { class: 'flex items-center justify-between w-full group' },
        [
          // Parte izquierda
          h('div', { class: 'flex items-center' }, [
            h('span', {
              style: { width: `${item.depth! * 1.5}rem` },
              class: 'inline-block'
            }),
            item.parentId !== null
              ? h(
                  'span',
                  {
                    class: 'mr-2 cursor-move text-gray-400 select-none',
                    style: { visibility: item.parentId ? 'visible' : 'hidden' }
                  },
                  '⋮⋮'
                )
              : null,
            item.hijos.length > 0
              ? h(
                  'button',
                  {
                    class:
                      'mr-2 px-2 py-1 rounded text-xs hover:bg-gray-100 transition-transform duration-300',
                    onClick: () => toggle(item.id)
                  },
                  [
                    h(
                      'span',
                      {
                        class: [
                          'inline-block transform transition-transform duration-300',
                          expanded.value.has(item.id) ? 'rotate-90' : 'rotate-0'
                        ]
                      },
                      '>' // este carácter se "rota"
                    )
                  ]
                )
              : h('span', { class: 'mr-4' }),
            h(
              'span',
              { class: `font-medium ${isTerminal ? 'text-blue-600' : ''}` },
              item.nombre
            ),
            isTerminal
              ? h(
                  'span',
                  { class: 'ml-2 px-1 text-xs bg-blue-100 rounded' },
                  'T'
                )
              : null
          ]),

          // Parte derecha: botones hover
          h(
            'div',
            { class: 'opacity-0 group-hover:opacity-100 flex space-x-1' },
            [
              h(
                'button',
                {
                  class: 'text-sm px-1 py-0.5 border rounded hover:bg-gray-100',
                  onClick: () => editar(item)
                },
                'Editar'
              ),
              h(
                'button',
                {
                  class: 'text-sm px-1 py-0.5 border rounded hover:bg-gray-100',
                  onClick: () => eliminar(item)
                },
                'Eliminar'
              )
            ]
          )
        ]
      )
    }
  },

  { accessorKey: 'internalcode', header: 'Código interno' },
  { accessorKey: 'externalcode', header: 'Código externo' },
  { accessorKey: 'cantidad', header: 'Cantidad' },
  {
    id: 'medidas',
    header: 'Medidas',
    cell: ({ row }: CellContext<NodoArbol, unknown>) => {
      const i = row.original
      if (!esTerminal(i.internalcode)) return ''
      return `${i.ancho ?? '-'} x ${i.largo ?? '-'}`
    }
  },
  {
    id: 'tipo',
    header: 'Tipo',
    cell: ({ row }: CellContext<NodoArbol, unknown>) => {
      const articulo = row.original.articulo
      if (!articulo?.tipoarticulos?.length) return ''
      return articulo.tipoarticulos[0].categid ?? ''
    }
  }
]

// ==========================================================
// Funciones de acciones
// ==========================================================
function editar(item: NodoArbol) {
  console.log('Editar', item)
}

function eliminar(item: NodoArbol) {
  console.log('Eliminar', item)
}
</script>

<template>
  <UTable :data="flatData" :columns="columns" ref="table">
    <template #tbody="{ rows }">
      <draggable
        :list="flatData"
        item-key="id"
        @change="onDragChange"
        :move="onMove"
      >
        <template #item="{ element: row }">
          <tr>
            <td>
              <UCheckbox v-model="rowSelection[row.id]" />
            </td>
            <td>
              <div class="flex items-center">
                <span :style="{ width: `${row.depth! * 1.5}rem` }"></span>
                <span v-if="row.parentId" class="cursor-move">⋮⋮</span>
                <button v-if="row.hijos.length" @click="toggle(row.id)">
                  {{ expanded.has(row.id) ? '-' : '+' }}
                </button>
                <span>{{ row.nombre }}</span>
              </div>
            </td>
            <td>{{ row.internalcode }}</td>
            <td>{{ row.externalcode }}</td>
            <td>{{ row.cantidad }}</td>
          </tr>
        </template>
      </draggable>
    </template>
  </UTable>

  <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
    {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
    {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
    selected.
  </div>
</template>
