<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, ref, watch } from 'vue'

// ==========================================================
// Tipos que coinciden con tu backend
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
// Prop recibido desde el padre
// ==========================================================
const props = defineProps<{
  data: NodoArbol
}>()

// ==========================================================
// Estados internos
// ==========================================================
const flatData = ref<NodoArbol[]>([])

// IMPORTANTE: reemplazamos el Set para que Vue detecte cambios
const expanded = ref<Set<string | number>>(new Set())

// ==========================================================
// Aplanar árbol
// ==========================================================
function flatten(
  node: NodoArbol,
  depth = 0,
  parentId: string | number | null = null
) {
  const copy = { ...node, depth, parentId }
  flatData.value.push(copy)

  if (expanded.value.has(node.id)) {
    for (const h of node.hijos) {
      flatten(h, depth + 1, node.id)
    }
  }
}

function rebuildFlatData() {
  flatData.value = []
  flatten(props.data)
}

// Construir por primera vez
rebuildFlatData()

// Watch para expandir/colapsar
watch(expanded, () => rebuildFlatData(), { deep: true })

// Watch por si cambia el árbol completo
watch(
  () => props.data,
  () => rebuildFlatData(),
  { deep: true }
)

// ==========================================================
// Toggle expand/collapse
// ==========================================================
function toggle(id: string | number) {
  if (expanded.value.has(id)) {
    expanded.value = new Set([...expanded.value].filter((x) => x !== id))
  } else {
    expanded.value = new Set([...expanded.value, id])
  }
}

// ==========================================================
// Columnas
// ==========================================================
const columns: TableColumn<NodoArbol>[] = [
  {
    id: 'nombre',
    header: 'Artículo',
    cell: ({ row }) => {
      const item = row.original

      return h('div', { class: 'flex items-center' }, [
        // Sangría
        h('span', {
          style: { width: `calc(${item.depth} * 1rem)` },
          class: 'inline-block'
        }),

        // Botón expandir/colapsar
        item.hijos.length > 0
          ? h(
              'button',
              {
                class: 'mr-2 text-sm px-1 border rounded',
                onClick: () => toggle(item.id)
              },
              expanded.value.has(item.id) ? '-' : '+'
            )
          : h('span', { class: 'mr-4' }),

        // Nombre
        h('span', {}, item.nombre)
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
    cell: ({ row }) => {
      const price = Number(row.original.precioUnitario)
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD'
      }).format(price)
    }
  },
  {
    accessorKey: 'costoTotal',
    header: 'Costo total',
    cell: ({ row }) => {
      const total = Number(row.original.costoTotal)
      return h(
        'div',
        { class: 'text-right font-medium' },
        new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'USD'
        }).format(total)
      )
    }
  }
]
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
