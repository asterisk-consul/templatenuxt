<script setup lang="ts">
const page = ref(1)
const limit = ref(25)

// Estado reactivo
const data = ref<any>(null)
const loading = ref(false)
const cache = ref<Record<number, any>>({})

// Función genérica para fetch
const fetchData = async (pageNum: number) => {
  return await $fetch('/api/articulos/articulostable', {
    baseURL: '/',
    query: {
      page: pageNum,
      limit: limit.value,
      expand: 'columns'
    }
  })
}

// Carga inicial en servidor
const { data: serverData } = await useFetch('/api/articulos/articulostable', {
  baseURL: '/',
  server: true,
  query: {
    page,
    limit,
    expand: 'columns'
  }
})

// Inicializar con datos del servidor
if (serverData.value) {
  console.log(serverData.value)
  cache.value[1] = serverData.value
  data.value = serverData.value
}

const onPageChange = async (newPage: number) => {
  // Si ya está en cache, usarlo inmediatamente
  if (cache.value[newPage]) {
    page.value = newPage
    data.value = cache.value[newPage]
    return
  }

  loading.value = true

  try {
    const response = await fetchData(newPage)

    // Guardar en cache
    cache.value[newPage] = response
    page.value = newPage
    data.value = response
  } catch (error) {
    console.error('Error loading page:', error)
  } finally {
    loading.value = false
  }
}

// Prefetch silencioso
const prefetchPage = async (pageNum: number) => {
  if (cache.value[pageNum]) return

  try {
    const response = await fetchData(pageNum)
    cache.value[pageNum] = response
  } catch {
    // Ignorar errores de prefetch
  }
}

// Prefetch de páginas cercanas
watch(page, (newPage) => {
  // Prefetch de la siguiente página
  prefetchPage(newPage + 1)

  // Opcional: prefetch de la página anterior si existe
  if (newPage > 1) {
    prefetchPage(newPage - 1)
  }
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
        v-show="data"
        table-key="articulos"
        :rows="data?.rows ?? []"
        :columns="data?.columns ?? []"
        :meta="data?.meta"
        :loading="loading"
        @page-change="onPageChange"
      />
    </template>
  </UDashboardPanel>
</template>
