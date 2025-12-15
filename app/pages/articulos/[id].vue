<script setup lang="ts">
import { useArticulosStore } from '@/stores/UseArticulosStores'
import FormArticulos from '~/components/articulos/FormularioArticulo/FormArticulos.vue'

const route = useRoute()
const articulosStore = useArticulosStore()
const id = route.params.id as string
const router = useRouter()
// Modo edición
const editando = ref(false)
const loading = ref(true)

watch(
  () => articulosStore.articuloActual,
  () => {
    loading.value = false
  }
)

onMounted(async () => {
  await articulosStore.fetchArticuloById(id)
})
</script>

<template>
  <UDashboardPanel id="articulos">
    <template #header>
      <UDashboardNavbar :title="'Articulos/' + articulosStore.articuloActual?.nombre == null ? '' : articulosStore.articuloActual?.nombre">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="flex items-center justify-between mb-4">
        <UButton color="primary" @click="router.back()">
          Volver
        </UButton>
        <h1 class="text-2xl font-semibold">
          {{ articulosStore.articuloActual?.nombre }}
        </h1>

        <UButton @click="editando = !editando">
          {{ editando ? 'Cancelar' : 'Editar' }}
        </UButton>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div v-if="loading">
        <div class="flex items-center gap-4">
          <USkeleton class="h-12 w-12 rounded-full" />

          <div class="grid gap-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </div>

      <div v-else>
        <UCard class="p-6 w-full">
          <FormArticulos
            :articuloEdit="articulosStore.articuloActual"
            :disabled="!editando"
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
