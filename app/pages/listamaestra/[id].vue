<script setup lang="ts">
import { useArticulosStore } from '~/stores/UseArticulosStores'
import ListaMaestra from '~/components/articulos/ListaMaestra/ListaMaestra.vue'
const route = useRoute()
const router = useRouter()

const id = route.params.id as string
const articulosStore = useArticulosStore()
const loading = ref<boolean>(true)

watch(
  () => articulosStore.articuloActual,
  () => {
    loading.value = false
  }
)

onMounted(async () => {
  await articulosStore.fetchArticuloById(String(id))
})
</script>

<template>
  <UDashboardPanel id="articulos">
    <template #header>
      <UDashboardNavbar :title="'Lista maestra'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="flex items-center justify-between mb-4">
        <UButton color="primary" @click="router.back()">Volver</UButton>
        <USkeleton v-if="loading" class="h-4 w-[250px]" />
        <h1 v-else class="text-2xl font-semibold">
          {{ articulosStore.articuloActual?.nombre }}
        </h1>
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
      <ListaMaestra v-else :id="Number(id)" />
    </template>
  </UDashboardPanel>
</template>
