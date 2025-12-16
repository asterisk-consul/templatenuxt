<script setup lang="ts">
import CardListas from '~/components/articulos/ListaMaestra/CardListas.vue'

const id = [1118, 1939]
</script>

<template>
  <UDashboardPanel id="listamaestra">
    <template #header>
      <UDashboardNavbar title="Listas Maestras" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid grid-cols-2 gap-4">
        <CardListas v-for="itemId in id" :key="itemId" :id="itemId" />
      </div>
    </template>
  </UDashboardPanel>
</template>
