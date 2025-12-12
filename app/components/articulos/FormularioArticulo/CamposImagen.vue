<script setup lang="ts">
import { ref } from 'vue'
import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'

interface Props {
  form: any
  disabled?: boolean
}

const props = defineProps<Props>()

const fileInput = ref<HTMLInputElement | null>(null)

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (ev) => {
    props.form.imagen = ev.target?.result as string // dataURL base64
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
    <!-- ID y Activo (opcional si querés dejarlo aquí) -->
    <div class="flex flex-col space-y-4 md:col-span-2">
      <div>
        <span class="block text-sm font-semibold text-gray-300">Id</span>
        <span class="text-xl font-bold">{{ form.id }}</span>
      </div>

      <LockedInput :disabled="disabled" label="Activo">
        <UCheckbox v-model="form.activo" />
      </LockedInput>
    </div>

    <!-- Imagen -->
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

          <!-- Placeholder si no hay imagen -->
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
</template>
