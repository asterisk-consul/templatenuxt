<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'

const worker = new Worker('/workers/exporter.js')
const articulosStore = useArticulosStore()
const toast = useToast()

const loading = ref(false)
const downloadMenu = ref(false)
const filterMenu = ref(false)
const table = useTemplateRef<any>('table')

const selectedFilterColumn = ref<string | null>(null)

const pagination = ref({
  pageIndex: 0,
  pageSize: 15
})

// Helpers para filtros
const availableColumns = computed(() => {
  return articulosStore.showableColumns.map((col) => ({
    label:
      col
        .split('.')
        .pop()
        ?.replace(/^\w/, (c) => c.toUpperCase()) || col,
    value: col
  }))
})

const availableValues = computed(() => {
  if (!selectedFilterColumn.value || !articulosStore.uniqueColumnValues)
    return []
  return articulosStore.uniqueColumnValues[selectedFilterColumn.value] || []
})

const activeFilters = computed(() => {
  if (!articulosStore.columnFilters) return []
  return Object.entries(articulosStore.columnFilters).filter(
    ([_, vals]) => vals.length > 0
  )
})

const removeFilter = (col: string, val: string) => {
  articulosStore.columnFilters[col] = articulosStore.columnFilters[col].filter(
    (v) => v !== val
  )
  if (articulosStore.columnFilters[col].length === 0) {
    delete articulosStore.columnFilters[col]
  }
}

worker.onmessage = (event) => {
  if (event.data.type === 'download') {
    const { filename, content, mime } = event.data

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
    toast.add({ title: 'Descarga completada', color: 'success' })
  } else if (event.data.type === 'error') {
    toast.add({
      title: 'Error en la descarga',
      description: event.data.error,
      color: 'error'
    })
  }
}

const downloadCSV = () => {
  downloadMenu.value = false // cerrar rápido
  toast.add({ title: 'Generando CSV...', color: 'info' })
  worker.postMessage({
    type: 'csv',
    data: toRaw(articulosStore.filteredRows)
  })
}
const downloadXLSX = () => {
  downloadMenu.value = false
  toast.add({ title: 'Generando Excel...', color: 'info' })
  worker.postMessage({
    type: 'xlsx',
    data: toRaw(articulosStore.filteredRows)
  })
}

const downloadJSON = () => {
  downloadMenu.value = false
  toast.add({ title: 'Generando JSON...', color: 'info' })
  worker.postMessage({
    type: 'json',
    data: toRaw(articulosStore.filteredRows)
  })
}

const currentPage = computed(
  () => (table.value?.tableApi?.getState().pagination.pageIndex ?? 0) + 1
)

const itemsPerPage = computed(
  () => table.value?.tableApi?.getState().pagination.pageSize ?? 10
)

const totalItems = computed(
  () => table.value?.tableApi?.getFilteredRowModel().rows.length ?? 0
)

const handlePageChange = (page: number) => {
  table.value?.tableApi?.setPageIndex(page - 1)
}

onMounted(async () => {
  loading.value = true
  await articulosStore.fetchArticulos()
  loading.value = false
})
</script>

<template>
  <UInput
    v-model="articulosStore.search"
    placeholder="Buscar..."
    class="mb-4"
  />
  <div class="flex gap-2 mb-4 items-center flex-wrap">
    <UPopover v-model:open="filterMenu" :popper="{ placement: 'bottom-start' }">
      <UButton icon="i-lucide-filter" color="white" variant="solid" size="xs">
        Filtros
      </UButton>

      <template #content>
        <div class="p-4 w-72 space-y-4">
          <UFormField label="Columna">
            <USelectMenu
              v-model="selectedFilterColumn"
              :items="availableColumns"
              label-attribute="label"
              value-attribute="value"
              placeholder="Seleccionar columna"
            />
          </UFormField>

          <UFormField v-if="selectedFilterColumn" label="Valores">
            <USelectMenu
              v-model="articulosStore.columnFilters[selectedFilterColumn]"
              :items="availableValues"
              multiple
              placeholder="Seleccionar valores"
            />
          </UFormField>
        </div>
      </template>
    </UPopover>

    <!-- Chips de filtros activos -->
    <template v-for="(filter, index) in activeFilters" :key="index">
      <div v-for="val in filter[1]" :key="val" class="flex items-center">
        <UBadge
          color="primary"
          variant="subtle"
          class="flex items-center gap-1"
        >
          {{ filter[0].split('.').pop() }}: {{ val }}
          <UButton
            icon="i-lucide-x"
            size="2xs"
            color="primary"
            variant="ghost"
            :padded="false"
            @click="removeFilter(filter[0], val)"
          />
        </UBadge>
      </div>
    </template>
  </div>

  <UPopover v-model:open="downloadMenu" :popper="{ placement: 'bottom-end' }">
    <UButton color="secondary" variant="outline" size="xs">Descargar ▼</UButton>

    <template #content>
      <div class="p-2 space-y-1">
        <UButton variant="ghost" block @click="downloadCSV">CSV</UButton>
        <UButton variant="ghost" block @click="downloadXLSX">Excel</UButton>
        <UButton variant="ghost" block @click="downloadJSON">JSON</UButton>
      </div>
    </template>
  </UPopover>

  <UTable
    ref="table"
    v-model:pagination="pagination"
    :loading="loading"
    loading-animation="carousel"
    :data="articulosStore.filteredRows"
    :columns="articulosStore.tableColumns"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
    :pagination-options="{
      getPaginationRowModel: getPaginationRowModel()
    }"
  />
  <div class="px-4 py-3.5 text-sm text-muted">
    Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} -
    {{ Math.min(currentPage * itemsPerPage, totalItems) }} de
    {{ totalItems }} fila(s)
  </div>
  <div class="flex justify-center border-t border-default pt-4 mt-4">
    <UPagination
      :default-page="currentPage"
      :items-per-page="itemsPerPage"
      :total="totalItems"
      @update:page="handlePageChange"
    />
  </div>
</template>
