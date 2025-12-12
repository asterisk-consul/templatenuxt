<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'

// Props
interface Hijo {
  id: string
  articuloid: string | null
  nombre: string
  alto?: number
  largo?: number
  ancho?: number
  unidad?: 'mm' | 'cm' | 'm'
  area?: number
  cantidad?: number
  precioUnitario?: number
}

interface Props {
  form: {
    hijos: Hijo[]
  }
  disabled?: boolean
}

const { form } = defineProps<Props>()

// Reactive hijos
const hijos = ref<Hijo[]>([...form.hijos])

// Función para agregar hijo
const agregarHijo = () => {
  hijos.value.push({
    id: Date.now().toString(),
    articuloid: null,
    nombre: '',
    alto: undefined,
    largo: undefined,
    ancho: undefined,
    unidad: 'mm',
    area: undefined,
    cantidad: undefined,
    precioUnitario: undefined
  })
}

// Función para eliminar hijo
const eliminarHijo = (index: number) => {
  hijos.value.splice(index, 1)
}

// Cálculo reactivo de área y cantidad
const calcular = (hijo: Hijo) => {
  if (!hijo.largo || !hijo.alto) {
    hijo.area = undefined
    hijo.cantidad = hijo.cantidad ?? 1
    return
  }

  // Convertir a metros según unidad
  let factor = 1
  switch (hijo.unidad) {
    case 'mm':
      factor = 0.001
      break
    case 'cm':
      factor = 0.01
      break
    case 'm':
      factor = 1
      break
  }

  const altoM = (hijo.alto ?? 0) * factor
  const largoM = (hijo.largo ?? 0) * factor

  hijo.area = altoM * largoM

  // Si hay precioUnitario, calcular cantidad = area * precioUnitario
  hijo.cantidad =
    hijo.area && hijo.precioUnitario
      ? hijo.area * hijo.precioUnitario
      : (hijo.cantidad ?? 1)
}

// Watch para recalcular cuando cambie dimensiones o unidad
watch(
  hijos,
  (newHijos) => {
    newHijos.forEach((hijo) => calcular(hijo))
  },
  { deep: true }
)
</script>

<template>
  <div>
    <button @click="agregarHijo" type="button">+ Agregar Artículo</button>

    <div
      v-for="(hijo, index) in hijos"
      :key="hijo.id"
      class="border p-2 my-2 rounded"
    >
      <LockedInput label="Nombre" v-model="hijo.nombre" :disabled="disabled" />

      <div class="grid grid-cols-3 gap-2 mt-2">
        <UInput
          v-model.number="hijo.alto"
          label="Alto"
          :disabled="disabled"
          type="number"
        />
        <UInput
          v-model.number="hijo.largo"
          label="Largo"
          :disabled="disabled"
          type="number"
        />
        <select v-model="hijo.unidad">
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
        </select>
      </div>

      <div class="mt-2">
        <span v-if="hijo.area">Área: {{ hijo.area.toFixed(2) }} m²</span>
        <span v-if="hijo.cantidad">
          Cantidad calculada: {{ hijo.cantidad.toFixed(2) }}
        </span>
      </div>

      <button
        @click="eliminarHijo(index)"
        type="button"
        class="mt-2 text-red-600"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>
