<script setup lang="ts">
import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'

interface Props {
  form: any
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
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
</template>
