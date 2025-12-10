<script setup lang="ts">
import { useArticulosStore } from '@/stores/UseArticulosStores'

const route = useRoute()
const articulosStore = useArticulosStore()

const id = Number(route.params.id)

onMounted(async () => {
  await articulosStore.fetchArticuloById(id)
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">
      Editar artículo #{{ id }}
    </h1>

    <div v-if="articulosStore.loading">Cargando…</div>
    <div v-else>
      <UForm :state="articulosStore.articuloEdit">
        <UFormGroup label="Nombre">
          <UInput v-model="articulosStore.articuloEdit.nombre" />
        </UFormGroup>

        <UButton color="primary">Guardar</UButton>
      </UForm>
    </div>
  </div>
</template>
