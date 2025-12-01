// composables/useTableColumns.ts
import type { TableColumn } from '#ui/types'
import { computed, h } from 'vue'
import { UBadge } from '#components'

export function useTableColumns<RowType>(
  showableColumns: Ref<string[]>,
  rows: Ref<RowType[]>
) {
  // Función para normalizar labels
  const normalizarLabel = (key: string) => {
    return (
      key
        .split('.')
        .pop()
        ?.replace(/^\w/, (c) => c.toUpperCase()) || key
    )
  }

  // Generación de columnas para UTable
  const tableColumns = computed<TableColumn<RowType>[]>(() => {
    return showableColumns.value.map((col) => ({
      id: col,
      accessorFn: (row) => row[col as keyof RowType],
      header: normalizarLabel(col),

      cell: ({ row }) => {
        const value = row.getValue(col)

        // boolean → chip
        if (typeof value === 'boolean') {
          return h(
            UBadge,
            {
              color: value ? 'success' : 'error',
              variant: 'subtle',
              class: 'capitalize'
            },
            () => (value ? 'Sí' : 'No')
          )
        }

        // fechas automáticas
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
          return new Date(value).toLocaleDateString()
        }

        // null/undefined
        if (value == null) return '-'

        return String(value)
      }
    }))
  })

  return { tableColumns }
}
