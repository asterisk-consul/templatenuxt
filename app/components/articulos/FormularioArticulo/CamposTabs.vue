<script setup lang="ts">
import TabsCompuestos from '~/components/articulos/FormularioArticulo/tabs/TabsCompuestos.vue'
import { tabsItems } from '~/components/articulos/FormularioArticulo/tabs/itemsTabs/items'

import LockedInput from '~/components/articulos/FormularioArticulo/ui/LocketInput.vue'

interface Props {
  form: any
  disabled?: boolean
}

defineProps<Props>()
</script>

<template>
  <UTabs variant="link" :items="tabsItems" class="md:col-span-2">
    <template #depositos>
      <span>Depositos</span>
    </template>

    <template #compuestos>
      <TabsCompuestos :form="form" :disabled="disabled" />
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
</template>
