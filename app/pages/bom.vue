<script setup>
import ArbolCostosTable from '~/components/articulos/ArbolCostosBom.vue'
const data = await fetchData('/articulos/arbol-costos/1118', { api: 'api2' })
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
