import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { DataTableColumn } from './types'
const UIcon = resolveComponent('UIcon')

export function adaptColumns(cols: DataTableColumn[]): TableColumn<any>[] {
  return cols.map((col) => ({
    id: col.key,
    accessorKey: col.key,
    enableSorting: col.sortable,
    enableColumnFilter: col.filterable,
    meta: {
      visible: col.visible ?? col.defaultVisible ?? true,
      type: col.type
    } as any,
    header: () =>
      h('div', { class: 'flex items-center gap-1' }, [
        h(UIcon, {
          name: 'i-lucide-grip-vertical',
          class: 'col-drag-handle w-4 h-4 text-gray-400'
        }),
        h('span', col.label)
      ]),
    cell: ({ getValue }) => formatCell(getValue(), col.type)
  }))
}

function formatCell(value: any, type?: string) {
  if (type === 'currency') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value)
  }
  if (type === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  return value
}
