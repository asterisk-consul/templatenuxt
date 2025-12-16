<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import CategoriaSelect from '@/components/categorias/CategoraisSelect.vue'

interface Props {
  open: boolean
  modelValue: ArticuloprecioForm | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'save', value: ArticuloprecioForm): void
  (e: 'cancel'): void
}>()

// Estado interno editable
const form = reactive<ArticuloprecioForm>({
  id: undefined,
  articuloid: undefined,
  categid: undefined, // ← CLAVE
  precio: 0,
  factorconversion: 1,
  changedate: new Date().toISOString()
})

// Si viene un registro → editar
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      Object.assign(form, {
        id: value.id,
        articuloid: value.articuloid,
        categid: value.categid,
        precio: value.precio,
        factorconversion: value.factorconversion,
        changedate: value.changedate
      })
    } else {
      Object.assign(form, {
        id: undefined,
        articuloid: undefined,
        categid: undefined,
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
  <UModal v-model:open="props.open" @update:open="emit('cancel')">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEdit ? 'Editar precio' : 'Nuevo precio' }}
      </h3>
    </template>
    <template #body>
      <UCard>
        <UForm @submit.prevent="emit('save', form)">
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Categoría</span>

              <CategoriaSelect
                v-model="form.categid"
                :grupos="['tipoprecio']"
              />
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Precio</span>
              <UInput v-model.number="form.precio" type="number" />
            </div>

            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium">Factor de conversión</span>
              <UInput v-model.number="form.factorconversion" type="number" />
            </div>
          </div>
        </UForm>
      </UCard>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 mt-6">
        <UButton variant="ghost" color="neutral" @click="emit('cancel')">
          Cancelar
        </UButton>

        <UButton type="submit" color="primary">
          {{ isEdit ? 'Guardar cambios' : 'Crear' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
