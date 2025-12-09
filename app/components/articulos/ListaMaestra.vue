<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, ref, watch } from 'vue'

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
const props = defineProps<{
  data: NodoArbol
}>()

// ==========================================================
// Estados
// ==========================================================
const flatData = ref<NodoArbol[]>([])
const expanded = ref<Set<string | number>>(new Set())

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

watch(expanded, () => rebuild(), { deep: true })
watch(() => props.data, () => rebuild(), { deep: true })

// ==========================================================
// Toggle
// ==========================================================
function toggle(id: string | number) {
  if (expanded.value.has(id)) {
    expanded.value = new Set([...expanded.value].filter(i => i !== id))
  } else {
    expanded.value = new Set([...expanded.value, id])
  }
}

// ==========================================================
// Helpers
// ==========================================================
function esTerminal(code: string | null | undefined) {
  if (!code) return false
  return code.trim().startsWith('T')
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
        h('span', {
          style: { width: `calc(${item.depth} * 1rem)` },
          class: 'inline-block'
        }),

        item.hijos.length > 0
          ? h(
              'button',
              {
                class: 'mr-2 px-1 border rounded text-xs',
                onClick: () => toggle(item.id)
              },
              expanded.value.has(item.id) ? '-' : '+'
            )
          : h('span', { class: 'mr-4' }),

        h('span', { class: 'font-medium' }, item.nombre)
      ])
    }
  },

  {
    accessorKey: 'internalcode',
    header: 'Código interno'
  },

  {
    accessorKey: 'externalcode',
    header: 'Código externo'
  },

  {
    accessorKey: 'cantidad',
    header: 'Cantidad'
  },

  {
    id: 'medidas',
    header: 'Medidas',
    cell: ({ row }) => {
      const i = row.original
      if (!esTerminal(i.internalcode)) return ''

      const ancho = i.ancho ?? '-'
      const largo = i.largo ?? '-'
      return `${ancho} x ${largo}`
    }
  },

  {
    id: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const articulo = row.original.articulo
      if (!articulo || !articulo.tipoarticulos) return ''

      const tipo = articulo.tipoarticulos[0]
      return tipo ? tipo.categid : ''
    }
  }
]
</script>

<template>
  <UTable
    :data="flatData"
    :columns="columns"
    :ui="{
      root: 'min-w-full',
      th: 'text-left bg-gray-100 font-semibold',
      td: 'align-top py-2 border-b'
    }"
  />
</template>
