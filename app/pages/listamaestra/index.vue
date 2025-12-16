<script setup>
import ListaMaestra from '~/components/articulos/ListaMaestra.vue'
const data = await fetchData('/api/articulos/compuestos/1118', { api: 'api2' })
console.log(data)
</script>

<template>
  <UDashboardPanel id="listamaestra">
    <template #header>
      <UDashboardNavbar title="Listado de Artículos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <ListaMaestra :data="data" />
    </template>
  </UDashboardPanel>
</template>
