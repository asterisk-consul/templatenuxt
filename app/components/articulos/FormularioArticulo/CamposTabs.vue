<script setup lang="ts">
import { tabsItems } from '~/components/articulos/FormularioArticulo/tabs/items'
import ListaMaestra from '~/components/articulos/ListaMaestra/ListaMaestra.vue'
import TabsPrecios from '~/components/articulos/FormularioArticulo/tabs/Precios/TabsPrecios.vue'
import { useArticulosStore } from '~/stores/UseArticulosStores'
const articulosStore = useArticulosStore()
interface Props {
  form: any
  disabled?: boolean
}
const loading = ref<boolean>(true)
const props = defineProps<Props>()
const articulo = ref<any[]>([])

onMounted(async () => {
  loading.value = true

  // Combinar la info de cada padre con los datos del artículo
  articulo.value = await Promise.all(
    props.form.articulos_padre.map(async (item: any) => {
      const padre = await articulosStore.fetchArticuloGroupById(
        String(item.parentarticuloid)
      )
      return {
        ...padre, // datos del artículo padre (nombre, id, etc.)
        cantidad: item.cantidad,
        alto: item.alto, // si existe
        largo: item.largo // si existe
      }
    })
  )

  loading.value = false
})
</script>

<template>
  <UTabs variant="link" :items="tabsItems" class="md:col-span-2">
    <template #depositos>
      <span>Depositos</span>
    </template>

    <template #compuestos>
      <UCard>
        <template #header>
          <h3>Donde se utilizan</h3>
        </template>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="art in articulo" :key="art.id" class="mb-4">
            <ul>
              <li>
                <strong>Nombre:</strong>
                {{ art.nombre }}
              </li>
              <li>
                <strong>Cantidad:</strong>
                {{ art.cantidad }}
              </li>
              <li v-if="art.alto">
                <strong>Alto:</strong>
                {{ art.alto }}
              </li>
              <li v-if="art.largo">
                <strong>Largo:</strong>
                {{ art.largo }}
              </li>
            </ul>
          </div>
        </div>
      </UCard>
      <ListaMaestra :id="form.id" />
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
