<script setup>
import ArbolCostosTable from '~/components/articulos/ArbolCostosBom.vue'
const { data, error, pending, refresh } = await useFetch(
  '/api/articulos/arbolcostos',
  {
    baseURL: '/',
    server: true
  }
)

useSeoMeta({
  title: 'Árbol de Costos'
})
</script>

<template>
  <UDashboardPanel id="bom">
    <template #header>
      <UDashboardNavbar title="Árbol de Costos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <ArbolCostosTable :data="data" />
    </template>
  </UDashboardPanel>
</template>
