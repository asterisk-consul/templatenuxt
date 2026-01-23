<script setup lang="ts">
const page = ref(1)
const limit = ref(25)
const { data, pending, error, refresh } = await useFetch(
  '/api/articulostable',
  {
    query: {
      page,
      limit,
      expand: 'columns'
    }
  }
)

onMounted(() => {
  console.log(data.value)
})
</script>

<template>
  <UDashboardPanel id="articulos">
    <template #header>
      <UDashboardNavbar title="Articulos" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <TablasTableAsterisk
        v-if="data"
        table-key="articulos"
        :rows="data.rows"
        :columns="data.columns"
        :meta="data.meta"
        :loading="pending"
      />
    </template>
  </UDashboardPanel>
</template>
