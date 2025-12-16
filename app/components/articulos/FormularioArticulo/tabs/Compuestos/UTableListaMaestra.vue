<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FlexRender } from '@tanstack/vue-table'
import { getColumnsListaMaestra } from './columnsListaMaestra'
import ModalComponente from './ModalCompuestos.vue'

interface Props {
  data: NodoListaMaestra[]
  disabled?: boolean
}

const props = defineProps<Props>()

// Estado para edición y drag & drop
const editingNode = ref<string | null>(null)
const dropTarget = ref<NodoListaMaestra | null>(null)
const draggedNode = ref<NodoListaMaestra | null>(null)

// Modal y form
const modalVisible = ref(false)
const nodoPadre = ref<NodoListaMaestra | null>(null)
const nodoEditando = ref<NodoListaMaestra | null>(null)
const form = reactive({
  articuloId: null as number | null,
  cantidad: 1,
  ancho: null as number | null,
  largo: null as number | null
})

// Handlers Drag & Drop (puedes personalizar)
const handleDragStart = (e: DragEvent, node: NodoListaMaestra) => {
  draggedNode.value = node
}
const handleDragEnd = () => {
  draggedNode.value = null
  dropTarget.value = null
}
const handleDragOver = (e: DragEvent, node: NodoListaMaestra) => {
  e.preventDefault()
  dropTarget.value = node
}
const handleDragLeave = () => {
  dropTarget.value = null
}
const handleDrop = (e: DragEvent, node: NodoListaMaestra) => {
  e.preventDefault()
  console.log('Drop', draggedNode.value, '->', node)
}

// Handlers agregar/editar
const handleAddChild = (node: NodoListaMaestra) => {
  nodoPadre.value = node
  nodoEditando.value = null
  Object.assign(form, {
    articuloId: null,
    cantidad: 1,
    ancho: null,
    largo: null
  })
  modalVisible.value = true
}

const handleEdit = (node: NodoListaMaestra) => {
  nodoEditando.value = node
  nodoPadre.value = null
  Object.assign(form, {
    articuloId: node.id,
    cantidad: node.cantidad,
    ancho: node.ancho,
    largo: node.largo
  })
  modalVisible.value = true
}

const handleDelete = (node: NodoListaMaestra) => {
  console.log('Eliminar nodo', node)
}

const handleSubmit = (payload: any) => {
  if (nodoPadre.value)
    console.log('Agregar hijo a', nodoPadre.value.nombre, payload)
  else if (nodoEditando.value)
    console.log('Editar nodo', nodoEditando.value.nombre, payload)
  modalVisible.value = false
}

// Columnas
const columns = getColumnsListaMaestra({
  editingNode,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleAddChild,
  handleEdit,
  handleDelete,
  disabled: props.disabled ?? false
})
onMounted(() => {
  console.log('columns', columns)
  console.log('data', props.data)
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-2">
      <h2 class="font-semibold">Estructura de Componentes</h2>
      <div class="flex gap-2">
        <UButton size="sm" variant="ghost" @click="$emit('expandAll')">
          Expandir Todo
        </UButton>
        <UButton size="sm" variant="ghost" @click="$emit('collapseAll')">
          Colapsar Todo
        </UButton>
      </div>
    </div>

    <!-- Tabla -->
    <UTable :items="props.data" :columns="columns">
      <template #cell="{ cell }">
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </template>
      <template #empty>
        <tr>
          <td :colspan="columns.length" class="text-center py-12 text-gray-500">
            No hay componentes en la estructura
          </td>
        </tr>
      </template>
    </UTable>

    <!-- Modal Agregar/Editar -->
    <ModalComponente
      v-model:show="modalVisible"
      :nodoPadre="nodoPadre"
      :nodo="nodoEditando"
      @submit="handleSubmit"
    />
  </div>
</template>
