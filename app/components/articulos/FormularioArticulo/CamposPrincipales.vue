<script setup lang="ts">
import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'
import CategoriaSelect from '~/components/categorias/CategoraisSelect.vue'

interface Props {
  form: any
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
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
    <CategoriaSelect
      v-model="form.categid"
      class="w-full"
      :grupos="['articulos']"
      showPath
    />
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
</template>
