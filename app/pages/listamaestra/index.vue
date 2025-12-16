<script setup>
import ListaMaestra from '~/components/articulos/ListaMaestra/ListaMaestra.vue'
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
      <ListaMaestra :id="1118" />
    </template>
  </UDashboardPanel>
</template>
