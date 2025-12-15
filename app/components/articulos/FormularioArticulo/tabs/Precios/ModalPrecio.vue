<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

interface Props {
  modelValue: Articuloprecio | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'save', value: Articuloprecio): void
  (e: 'cancel'): void
}>()

// Estado interno editable
const form = reactive<Articuloprecio>({
  id: 0,
  articuloid: 0,
  categid: 0,
  precio: 0,
  factorconversion: 1,
  changedate: new Date().toISOString()
})

// Si viene un registro → editar
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      Object.assign(form, structuredClone(value))
    } else {
      // crear nuevo
      Object.assign(form, {
        id: 0,
        articuloid: 0,
        categid: 0,
        precio: 0,
        factorconversion: 1,
        changedate: new Date().toISOString()
      })
    }
  },
  { immediate: true }
)

const isEdit = computed(() => !!props.modelValue)
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEdit ? 'Editar precio' : 'Nuevo precio' }}
      </h3>
    </template>

    <UForm @submit.prevent="emit('save', form)">
      <div class="space-y-4">
        <UInput
          v-model.number="form.precio"
          type="number"
          label="Precio"
        />

        <UInput
          v-model.number="form.factorconversion"
          type="number"
          label="Factor de conversión"
        />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <UButton
          variant="ghost"
          color="neutral"
          @click="emit('cancel')"
        >
          Cancelar
        </UButton>

        <UButton type="submit" color="primary">
          {{ isEdit ? 'Guardar cambios' : 'Crear' }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
