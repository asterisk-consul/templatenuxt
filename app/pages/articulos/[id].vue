<script setup lang="ts">
import { useArticulosStore } from '@/stores/UseArticulosStores'
import FormArticulos from '~/components/articulos/FormularioArticulo/FormArticulos.vue'

const route = useRoute()
const articulosStore = useArticulosStore()
const id = route.params.id as string

// Modo edición
const editando = ref(false)

onMounted(async () => {
  await articulosStore.fetchArticuloById(id)
  console.log('articuloEdit', articulosStore.articuloEdit)
})
</script>

<template>
  <UDashboardPanel id="articulos">
    <template #header>
      <UDashboardNavbar title="Articulos">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-semibold">
          {{ articulosStore.articuloEdit?.nombre }}
        </h1>

        <UButton @click="editando = !editando">
          {{ editando ? 'Cancelar' : 'Editar' }}
        </UButton>
      </div>

      <div v-if="articulosStore.loading">Cargando…</div>

      <div v-else>
        <UCard class="p-6 w-full">
          <FormArticulos
            :articuloEdit="articulosStore.articuloEdit"
            :disabled="!editando"
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
