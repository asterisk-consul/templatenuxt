<script setup lang="ts">
import { useDataTable } from './useDataTable'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTablePagination from './DataTablePagination.vue'
import type { DataTableColumn, DataTableMeta } from './types'

const props = defineProps<{
  tableKey: string
  rows: any[]
  columns: DataTableColumn[]
  meta: DataTableMeta
  selectable?: boolean
  deletable?: boolean
}>()

const { data, visibleColumns, toggleColumn, reorderColumns } = useDataTable(
  props.tableKey,
  props.rows,
  props.columns
)
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar :columns="columns" @toggle="toggleColumn" />

    <UTable :data="data" :columns="visibleColumns" sticky />

    <DataTablePagination :meta="meta" />
  </div>
</template>
