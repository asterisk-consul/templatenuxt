<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
const articulosStore = useArticulosStore()

const { exportCSV, exportExcel, exportJSON } = useExportData()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const modalOpen = ref(false)

const loading = ref(false)
import { useImportArticulos } from '@/composables/useImportArticulos'

const {
  progress,
  totalprocess,
  error,
  finished,
  resultsOk,
  resultsError,
  startImport
} = useImportArticulos()

const downloadMenu = ref(false)
const table = useTemplateRef<any>('table')
const pagination = ref({
  pageIndex: 0,
  pageSize: 20
})

const selectFile = () => {
  fileInput.value?.click()
}

const handleFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  modalOpen.value = true

  try {
    await startImport(file)
  } catch (err) {
    console.error('Error importando:', err)
  } finally {
    // limpia el input para permitir subir el mismo archivo de nuevo
    target.value = ''
  }
}
const downloadCSV = async () => {
  const rows = toRaw(articulosStore.exportRows)

  toast.add({ title: 'Generando CSV...', color: 'info' })

  try {
    await exportCSV(rows, 'articulos.csv')
    toast.add({ title: 'CSV descargado', color: 'success' })
  } catch (err) {
    toast.add({
      title: 'Error generando CSV',
      color: 'error',
      description: String(err)
    })
  }
}

const downloadXLSX = async () => {
  const rows = toRaw(articulosStore.exportRows)

  toast.add({ title: 'Generando Excel...', color: 'info' })

  try {
    await exportExcel(rows, 'articulos.xlsx')
    toast.add({ title: 'Excel descargado', color: 'success' })
  } catch (err) {
    toast.add({
      title: 'Error generando Excel',
      color: 'error',
      description: String(err)
    })
  }
}

const downloadJSON = async () => {
  const rows = toRaw(articulosStore.exportRows)

  toast.add({ title: 'Generando JSON...', color: 'info' })

  try {
    await exportJSON(rows, 'articulos.json')
    toast.add({ title: 'JSON descargado', color: 'success' })
  } catch (err) {
    toast.add({
      title: 'Error generando JSON',
      color: 'error',
      description: String(err)
    })
  }
}

// const filterMenu = ref(false)
// const selectedFilterColumn = ref<string | null>(null)

// Helpers para filtros
// const availableColumns = computed(() => {
//   return articulosStore.showableColumns.map((col) => ({
//     label:
//       col
//         .split('.')
//         .pop()
//         ?.replace(/^\w/, (c) => c.toUpperCase()) || col,
//     value: col
//   }))
// })

// const availableValues = computed(() => {
//   if (!selectedFilterColumn.value || !articulosStore.uniqueColumnValues)
//     return []
//   return articulosStore.uniqueColumnValues[selectedFilterColumn.value] || []
// })

// const activeFilters = computed(() => {
//   if (!articulosStore.columnFilters) return []
//   return Object.entries(articulosStore.columnFilters).filter(
//     ([_, vals]) => vals.length > 0
//   )
// })

// const removeFilter = (col: string, val: string) => {
//   articulosStore.columnFilters[col] = articulosStore.columnFilters[col].filter(
//     (v) => v !== val
//   )
//   if (articulosStore.columnFilters[col].length === 0) {
//     delete articulosStore.columnFilters[col]
//   }
// }

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
  <div class="flex gap-2 mb-4 items-center justify-between flex-wrap">
    <UInput v-model="articulosStore.search" placeholder="Buscar..." />
    <!-- <div class="flex gap-2 mb-4 items-center flex-wrap">
    <UPopover v-model:open="filterMenu" :popper="{ placement: 'bottom-start' }">
      <UButton icon="i-lucide-filter" color="neutral" variant="solid">
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
            color="primary"
            variant="ghost"
            :padded="false"
            @click="removeFilter(filter[0], val)"
          />
        </UBadge>
      </div>
    </template>
  </div> -->

    <UButton color="primary" @click="selectFile">Importar archivo</UButton>

    <!-- Input oculto -->
    <input
      ref="fileInput"
      type="file"
      accept=".csv, .xlsx, .json"
      class="hidden"
      @change="handleFile"
    />
    <UPopover
      v-model:open="downloadMenu"
      class="w-40"
      :popper="{ placement: 'bottom-end' }"
      :ui="{ content: 'w-(--reka-popper-anchor-width) cursor-pointer' }"
    >
      <UButton
        class="cursor-pointer justify-center"
        color="secondary"
        variant="outline"
      >
        Descargar ▼
      </UButton>

      <template #content>
        <div class="space-y-1 w-full">
          <!-- CSV -->
          <UButton
            class="cursor-pointer"
            variant="ghost"
            block
            @click="downloadCSV"
          >
            <template #leading>
              <Icon name="mdi:file-delimited-outline" class="w-5 h-5" />
            </template>
            CSV
          </UButton>

          <!-- Excel -->
          <UButton
            class="cursor-pointer"
            variant="ghost"
            block
            @click="downloadXLSX"
          >
            <template #leading>
              <Icon
                name="mdi:file-excel-outline"
                class="w-5 h-5 text-green-600"
              />
            </template>
            Excel
          </UButton>

          <!-- JSON -->
          <UButton
            class="cursor-pointer"
            variant="ghost"
            block
            @click="downloadJSON"
          >
            <template #leading>
              <Icon name="mdi:code-json" class="w-5 h-5 text-yellow-600" />
            </template>
            JSON
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>

  <UTable
    ref="table"
    v-model:pagination="pagination"
    :loading="loading"
    loading-animation="carousel"
    :data="articulosStore.filteredRows"
    :columns="articulosStore.tableColumns"
    sticky
    class="w-full h-full"
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
  <div class="px-2 py-1 text-sm text-muted">
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
  <UModal v-model:open="modalOpen">
    <template #header>
      <h3 class="text-lg font-semibold">Importando artículos…</h3>
    </template>

    <template #content>
      <UCard class="p-6 space-y-4">
        <UProgress
          v-if="!finished && totalprocess"
          :value="(progress / totalprocess) * 100"
        />

        <p class="text-sm text-gray-600">
          {{ progress }} / {{ totalprocess }} procesados
        </p>

        <p v-if="error" class="text-red-600">
          {{ error }}
        </p>

        <!-- ✔ Resultados correctos -->
        <div v-if="finished && resultsOk.length">
          <h4 class="font-bold text-green-600">Actualizados correctamente</h4>
          <ul class="pl-4 text-sm text-green-700">
            <li v-for="r in resultsOk" :key="r.id">
              ID {{ r.id }} — {{ r.nombre }} (OK)
            </li>
          </ul>
        </div>

        <!-- ❌ Errores -->
        <div v-if="finished && resultsError.length">
          <h4 class="font-bold text-red-600">Errores</h4>
          <ul class="pl-4 text-sm text-red-700">
            <li v-for="r in resultsError" :key="r.id">
              ID {{ r.id }} — {{ r.nombre }} — {{ r.msg }}
            </li>
          </ul>
        </div>

        <div class="flex justify-end">
          <UButton v-if="finished" color="primary" @click="modalOpen = false">
            Cerrar
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
