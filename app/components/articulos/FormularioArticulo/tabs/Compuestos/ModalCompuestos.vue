<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

interface Props {
  show: boolean
  nodoPadre?: NodoListaMaestra | null
  nodo?: NodoListaMaestra | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'submit', payload: any): void
}>()

const isEditar = computed(() => !!props.nodo)

// Form
const form = reactive({
  articuloId: props.nodo?.id || null,
  cantidad: props.nodo?.cantidad || 1,
  ancho: props.nodo?.ancho || null,
  largo: props.nodo?.largo || null,
  busqueda: ''
})

// Lista de artículos disponibles (solo para agregar)
const articulosDisponibles = ref<any[]>([])
const loadingArticulos = ref(false)
let searchTimeout: NodeJS.Timeout

watch(
  () => form.busqueda,
  async (query: string) => {
    if (!query || query.length < 2) {
      articulosDisponibles.value = []
      return
    }
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      loadingArticulos.value = true
      // Llamar API aquí
      articulosDisponibles.value = [
        { id: 1, nombre: 'Articulo A', internalcode: 'A01', um: 'kg' },
        { id: 2, nombre: 'Articulo B', internalcode: 'B01', um: 'kg' }
      ].filter((a) => a.nombre.toLowerCase().includes(query.toLowerCase()))
      loadingArticulos.value = false
    }, 300)
  }
)

const submit = () => {
  if (!isEditar.value && !form.articuloId) {
    alert('Selecciona un artículo')
    return
  }
  emit('submit', {
    ...form,
    padre: props.nodoPadre,
    nodo: props.nodo
  })
  emit('update:show', false)
}

const close = () => emit('update:show', false)
</script>

<template>
  <UModal v-model="props.show">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          {{
            isEditar
              ? `Editar: ${props.nodo?.nombre}`
              : `Agregar Componente a: ${props.nodoPadre?.nombre}`
          }}
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="close"
        />
      </div>
    </template>
    <template #body>
      <UCard>
        <UForm class="space-y-4">
          <!-- Solo mostrar búsqueda si es agregar -->
          <div v-if="!isEditar">
            <UInput
              v-model="form.busqueda"
              placeholder="Código o nombre del artículo..."
              icon="i-heroicons-magnifying-glass"
            />

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
                  'bg-blue-50 border-blue-500': form.articuloId === art.id
                }"
                @click="form.articuloId = art.id"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">{{ art.nombre }}</p>
                    <p class="text-sm text-gray-500">
                      {{ art.internalcode }} - {{ art.um }}
                    </p>
                  </div>
                  <UIcon
                    v-if="form.articuloId === art.id"
                    name="i-heroicons-check-circle"
                    class="text-blue-600 text-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UInput
              v-model.number="form.cantidad"
              type="number"
              min="0"
              step="0.01"
            />

            <UInput value="Heredada del artículo" disabled />

            <UInput
              v-model.number="form.ancho"
              type="number"
              min="0"
              step="0.01"
              placeholder="mm"
            />

            <UInput
              v-model.number="form.largo"
              type="number"
              min="0"
              step="0.01"
              placeholder="mm"
            />
          </div>
        </UForm>
      </UCard>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="close">
          Cancelar
        </UButton>
        <UButton :disabled="!isEditar && !form.articuloId" @click="submit">
          {{ isEditar ? 'Guardar Cambios' : 'Agregar Componente' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
