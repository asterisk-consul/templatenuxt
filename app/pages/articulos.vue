<script setup lang="ts">
import TablaArticulos from '@/components/articulos/TablaArticulos.vue'
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <TablaArticulos />
    </template>
  </UDashboardPanel>
</template>
