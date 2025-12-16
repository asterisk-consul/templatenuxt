<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UTableListaMaestra from '@/components/articulos/FormularioArticulo/tabs/Compuestos/UTableListaMaestra.vue'
import { useArticulosStore } from '@/stores/UseArticulosStores'

const articulosStore = useArticulosStore()
const data = ref<NodoListaMaestra[]>([])

interface Props {
  id: number
  disabled?: boolean
}

const props = defineProps<Props>()

onMounted(async () => {
  await articulosStore.fetchListaMaestra(props.id)
  if (articulosStore.listaMaestra) {
    data.value = [articulosStore.listaMaestra] // o aplana si quieres
  }
})
</script>

<template>
  <div class="p-4 space-y-4">
    <UTableListaMaestra :data="data" />
  </div>
</template>
