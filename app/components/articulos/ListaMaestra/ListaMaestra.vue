<script setup lang="ts">
import { ref, watch, h, resolveComponent, onMounted } from 'vue'

import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { createColumns } from './columns'

const UCheckbox = resolveComponent('UCheckbox')
const UBadge = resolveComponent('UBadge')

// ==========================================================
// Props
// ==========================================================
const props = defineProps<{ id: number }>()

// Importar store
import { useArticulosStore } from '~/stores/UseArticulosStores'
const articulosStore = useArticulosStore()

// ==========================================================
// Estados
// ==========================================================
const flatData = ref<NodoArbol[]>([])
const expanded = ref<Set<string | number>>(new Set())
const rowSelection = ref<Record<string, boolean>>({})
const table = useTemplateRef('table')
const loading = ref<boolean>(false)

// ==========================================================
// Helpers
// ==========================================================
import { esTerminal } from './helpers'

// ==========================================================
// Flatten tree
// ==========================================================
import { flatten, rebuild } from './flatten'

watch(
  expanded,
  () => rebuild(articulosStore.listaMaestra, flatData, expanded, rowSelection),
  { deep: true }
)
watch(
  () => articulosStore.listaMaestra,
  () => rebuild(articulosStore.listaMaestra, flatData, expanded, rowSelection),
  { deep: true }
)

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
// Drag & Drop
// ==========================================================
function onMove(evt: any) {
  const dragged = evt.draggedContext.element
  const target = evt.relatedContext.element

  if (!dragged.parentId) return false

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
// Funciones de acciones
// ==========================================================
import { editar, eliminar } from './actions'
// ==========================================================
// Columnas
// ==========================================================
const columns = createColumns(
  rowSelection.value,
  expanded.value,
  toggle,
  editar,
  eliminar,
  esTerminal,
  UCheckbox
)

watch(
  () => articulosStore.loadingListaMaestra,
  () => (loading.value = articulosStore.loadingListaMaestra)
)

// ==========================================================
// Mounted
// ==========================================================
onMounted(async () => {
  await articulosStore.fetchListaMaestra(String(props.id))
  rebuild(articulosStore.listaMaestra, flatData, expanded, rowSelection)
})
</script>

<template>
  <UTable :data="flatData" :columns="columns" ref="table" :loading="loading">
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
                <button v-if="row.hijos?.length" @click="toggle(row.id)">
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
    {{ Object.values(rowSelection).filter(Boolean).length }} of
    {{ flatData.length }} row(s) selected.
  </div>
</template>
