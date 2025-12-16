<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticulosStore } from '~/stores/UseArticulosStores'

const props = defineProps<{ id: number }>()
const articulosStore = useArticulosStore()
const loading = ref(true)
const articulo = ref<Partial<ArticulosApiN> | null>(null)

onMounted(async () => {
  articulo.value = await articulosStore.fetchArticuloGroupById(String(props.id))
  loading.value = false
})
</script>

<template>
  <UCard
    v-if="!loading"
    :ui="{
      base: 'overflow-hidden transition-all duration-300 hover:shadow-xl',
      body: 'p-0',
      header: 'p-0',
      footer: 'p-4'
    }"
  >
    <template #header>
      <div class="relative w-full h-56 overflow-hidden bg-gray-100">
        <img
          :src="articulo?.imagen"
          :alt="articulo?.nombre"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div class="px-6 py-4">
        <h2 class="text-2xl font-bold text-gray-800 line-clamp-2">
          {{ articulo?.nombre }}
        </h2>
      </div>
    </template>

    <template #footer>
      <UButton
        color="primary"
        :to="`/listamaestra/${props.id}`"
        block
        size="lg"
      >
        Ver Detalles
      </UButton>
    </template>
  </UCard>
</template>
