<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, ref, watch, onMounted } from 'vue'

// ==========================================================
// Tipos
// ==========================================================
type NodoArbol = {
  id: string | number
  nombre: string
  precioUnitario: number
  cantidad: number
  costoTotal: number
  hijos: NodoArbol[]
  depth?: number
  parentId?: string | number | null
}

// ==========================================================
// Props (SSR-safe)
// ==========================================================
const props = defineProps<{
  data?: NodoArbol
}>()

// ==========================================================
// State
// ==========================================================
const flatData = ref<NodoArbol[]>([])

// Usamos Set pero recreándolo para mantener reactividad
const expanded = ref<Set<string | number>>(new Set())

// ==========================================================
// Flatten tree (seguro para SSR)
// ==========================================================
function flatten(
  node: NodoArbol | undefined,
  depth = 0,
  parentId: string | number | null = null
) {
  if (!node) return

  const copy: NodoArbol = {
    ...node,
    depth,
    parentId
  }

  flatData.value.push(copy)

  if (expanded.value.has(node.id) && Array.isArray(node.hijos)) {
    for (const child of node.hijos) {
      flatten(child, depth + 1, node.id)
    }
  }
}

function rebuildFlatData() {
  flatData.value = []

  if (!props.data) return

  flatten(props.data)
}

// ==========================================================
// Watchers
// ==========================================================

// Cuando llega data (async / SSR)
watch(
  () => props.data,
  () => rebuildFlatData(),
  { immediate: true, deep: true }
)

// Expand / collapse
watch(expanded, () => rebuildFlatData(), { deep: true })

// ==========================================================
// Toggle
// ==========================================================
function toggle(id: string | number) {
  if (expanded.value.has(id)) {
    expanded.value = new Set([...expanded.value].filter((x) => x !== id))
  } else {
    expanded.value = new Set([...expanded.value, id])
  }
}

// ==========================================================
// Columns
// ==========================================================
const columns: TableColumn<NodoArbol>[] = [
  {
    id: 'nombre',
    header: 'Artículo',
    cell: ({ row }) => {
      const item = row.original

      return h('div', { class: 'flex items-center' }, [
        // Indentación
        h('span', {
          class: 'inline-block',
          style: { width: `${(item.depth ?? 0) * 1}rem` }
        }),

        // Botón expandir
        item.hijos?.length
          ? h(
              'button',
              {
                class: 'mr-2 text-sm px-1 border rounded hover:bg-gray-100',
                onClick: () => toggle(item.id)
              },
              expanded.value.has(item.id) ? '−' : '+'
            )
          : h('span', { class: 'mr-4' }),

        // Nombre
        h('span', item.nombre)
      ])
    }
  },
  {
    accessorKey: 'cantidad',
    header: 'Cantidad'
  },
  {
    accessorKey: 'precioUnitario',
    header: 'Precio unitario',
    cell: ({ row }) =>
      new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD'
      }).format(Number(row.original.precioUnitario))
  },
  {
    accessorKey: 'costoTotal',
    header: 'Costo total',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-right font-medium' },
        new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(row.original.costoTotal))
      )
  }
]

// Debug opcional
onMounted(() => {
  console.log('Árbol recibido:', props.data)
})
</script>

<template>
  <UTable
    :data="flatData"
    :columns="columns"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  />
</template>
