<script setup lang="ts">
import { tabsItems } from '~/components/articulos/FormularioArticulo/tabs/items'
import TabsCompuestos from '~/components/articulos/FormularioArticulo/tabs/Compuestos/TabsCompuestos.vue'
import TabsPrecios from '~/components/articulos/FormularioArticulo/tabs/Precios/TabsPrecios.vue'

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
      <TabsCompuestos :form="form" :disabled="disabled" :id="form.id" />
    </template>

    <template #precios>
      <TabsPrecios :form="form" :disabled="disabled" />
    </template>

    <template #proveedores>
      <span>Proveedores</span>
    </template>

    <template #especificaciones>
      <span>Especificaciones</span>
    </template>
    <template #centros>
      <span>Centros de costo</span>
    </template>
  </UTabs>
</template>
