<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import LockedInput from '@/components/articulos/FormularioArticulo/LocketInput.vue'

interface Props {
  articuloEdit: Partial<ArticulosApiN> | null
  disabled?: boolean
}

const props = defineProps<Props>()

const form = reactive<Partial<ArticulosApiN>>({
  imagen: null
})

const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.articuloEdit,
  (val) => {
    if (val) {
      Object.assign(form, val)
    }
  },
  { immediate: true }
)
const items = [
  {
    label: 'Depositos',
    icon: 'i-lucide-warehouse',
    slot: 'depositos'
  },
  {
    label: 'Precios',
    icon: 'i-lucide-tags',
    slot: 'precios'
  },
  {
    label: 'Compuestos',
    icon: 'i-lucide-layers',
    slot: 'compuestos'
  },
  {
    label: 'Especificaciones',
    icon: 'i-lucide-book-open-text',
    slot: 'especificaciones'
  },
  {
    label: 'Proveedores',
    icon: 'i-lucide-factory',
    slot: 'proveedores'
  }
]
function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (ev) => {
    form.imagen = ev.target?.result as string // esto será un dataURL base64
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <UForm :state="form" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    <!-- SECCIÓN SUPERIOR -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
      <!-- Columna izquierda (Id + Activo) -->
      <div class="flex flex-col space-y-4 md:col-span-2">
        <div>
          <span class="block text-sm font-semibold text-gray-300">Id</span>
          <span class="text-xl font-bold">{{ form.id }}</span>
        </div>

        <LockedInput :disabled="disabled" label="Activo">
          <UCheckbox v-model="form.activo" />
        </LockedInput>
      </div>

      <!-- Columna derecha (Imagen) -->
      <div class="flex flex-col items-start md:items-end">
        <LockedInput :disabled="disabled" label="Imagen">
          <div
            class="border border-gray-600 rounded-lg p-2 w-32 h-32 flex items-center justify-center cursor-pointer bg-gray-900"
            :class="{ 'opacity-50 cursor-default': disabled }"
            @click="!disabled && fileInput?.click()"
          >
            <!-- Imagen cargada -->
            <img
              v-if="form.imagen"
              :src="form.imagen"
              class="object-cover w-full h-full rounded"
            />

            <!-- Placeholder -->
            <div
              v-else
              class="text-gray-500 flex flex-col items-center text-center"
            >
              <UIcon name="i-heroicons-photo" class="w-10 h-10 mb-1" />
              <span class="text-xs">Sin imagen</span>
              <span v-if="!disabled" class="text-xs">Click para subir</span>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelected"
          />
        </LockedInput>
      </div>
    </div>

    <!-- resto de campos -->
    <LockedInput :disabled="disabled" label="Nombre" class="md:col-span-2">
      <UInput v-model="form.nombre" class="w-full" />
    </LockedInput>
    <LockedInput :disabled="disabled" label="InternalCode">
      <UInput v-model="form.internalcode" class="w-full" />
    </LockedInput>
    <LockedInput :disabled="disabled" label="ExternalCode">
      <UInput v-model="form.externalcode" class="w-full" />
    </LockedInput>
    <LockedInput :disabled="disabled" label="Cuentas Contables">
      <UInput v-model="form.cuentacontableid" class="w-full" />
    </LockedInput>
    <LockedInput :disabled="disabled" label="Categoría">
      <UInput v-model="form.categid" class="w-full" />
    </LockedInput>
    <LockedInput :disabled="disabled" label="Descripción" class="md:col-span-2">
      <UTextarea v-model="form.descrip" class="w-full" />
    </LockedInput>
    <LockedInput
      :disabled="disabled"
      label="Características"
      class="md:col-span-2"
    >
      <UInput v-model="form.caracteristicas" class="w-full" />
    </LockedInput>

    <div
      class="grid grid-cols-1 md:grid-cols-4 gap-6 md:col-span-2 place-items-center"
    >
      <LockedInput :disabled="disabled" label="Es Cheque">
        <UCheckbox v-model="form.ischeque" />
      </LockedInput>
      <LockedInput :disabled="disabled" label="Es Servicio">
        <UCheckbox v-model="form.isservice" />
      </LockedInput>
      <LockedInput :disabled="disabled" label="Es a medida">
        <UCheckbox v-model="form.isamedida" />
      </LockedInput>
      <LockedInput :disabled="disabled" label="Calcular Costo">
        <UCheckbox v-model="form.isbom" />
      </LockedInput>
    </div>

    <UTabs variant="link" :items="items" class="md:col-span-2">
      <template #depositos>
        <span>Depositos</span>
      </template>
      <template #compuestos>
        <span>Compuestos</span>
      </template>
      <template #precios>
        <span>Precios</span>
      </template>
      <template #proveedores>
        <span>Proveedores</span>
      </template>
      <template #especificaciones>
        <span>Especificaciones</span>
      </template>
    </UTabs>
  </UForm>
</template>
