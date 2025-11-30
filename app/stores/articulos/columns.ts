// stores/articulos/columns.ts
import { h, computed } from 'vue'
import { UBadge } from '#components'

export const tableColumns = computed(() => {
  return showableColumns.value.map((col) => ({
    id: col,
    accessorFn: (row) => row[col],
    header: normalizarLabel(col),

    cell: ({ row }) => {
      const value = row.getValue(col)

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

      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return new Date(value).toLocaleDateString()
      }

      return value ?? '-'
    }
  }))
})

function normalizarLabel(key: string) {
  return (
    key
      .split('.')
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || key
  )
}
