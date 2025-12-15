<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useTablePagination } from '@/composables/useTablePagination'
import { useArticulosTable } from '@/composables/useArticuloTable'

const articulosStore = useArticulosStore()

const { exportCSV, exportExcel, exportJSON } = useExportData()

const {
  tableColumns,
  filteredRows,
  search,
  filterFields,
  columnFilters,
  uniqueColumnValues,
  exportRows
} = useArticulosTable(
  toRef(articulosStore, 'rows'),
  toRef(articulosStore, 'showableColumns')
)

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

const { pagination, currentPage, itemsPerPage, totalItems, handlePageChange } =
  useTablePagination(table, 0, 20)

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
  const rows = toRaw(exportRows.value)

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
  const rows = toRaw(exportRows.value)

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
  const rows = toRaw(exportRows.value)

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

onMounted(async () => {
  loading.value = true
  await articulosStore.fetchArticulos()
  loading.value = false
})
</script>

<template>
  <div class="flex gap-2 mb-4 items-center justify-between flex-wrap">
    <UInput v-model="search" placeholder="Buscar..." />

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
  <!--
  <USelect
    v-model="articulosStore.showableColumns"
    multiple
    :items="articulosStore.cols"
  /> -->

  <UTable
    ref="table"
    v-model:pagination="pagination"
    :loading="loading"
    loading-animation="carousel"
    :data="filteredRows"
    :columns="tableColumns"
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
