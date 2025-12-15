// composables/useTableColumns.ts
import type { TableColumn } from '#ui/types'
import { computed, h } from 'vue'
import { UBadge } from '#components'
import { NuxtLink } from '#components'

export function useTableColumns<RowType>(
  showableColumns: Ref<string[]>,
  rows: Ref<RowType[]>,
  options?: {
    clickable?: string[] // columnas clickeables (key visible)
    linkTo?: (row: RowType) => string // genera la ruta destino al hacer clic
  }
) {
  // Clave visible sin puntos (UTable no acepta puntos)
  const visibleKey = (key: string) =>
    key.includes('.') ? key.split('.').pop()! : key

  const headerLabel = (key: string) => {
    const k = visibleKey(key)
    return k.charAt(0).toUpperCase() + k.slice(1)
  }

  const tableColumns = computed<TableColumn<RowType>[]>(() =>
    showableColumns.value.map((col) => {
      const vk = visibleKey(col)
      const isClickable = options?.clickable?.includes(vk)

      const column: TableColumn<RowType> = {
        id: col,
        accessorKey: vk,
        header: headerLabel(col),

        cell: ({ row }) => {
          const realValue = row.original[col as keyof RowType]

          // BOOLEAN → badge
          if (typeof realValue === 'boolean') {
            return h(
              UBadge,
              {
                color: realValue ? 'success' : 'error',
                variant: 'subtle',
                class: 'capitalize'
              },
              () => (realValue ? 'Sí' : 'No')
            )
          }

          // FECHAS YYYY-MM-DD
          if (
            typeof realValue === 'string' &&
            /^\d{4}-\d{2}-\d{2}/.test(realValue)
          ) {
            return new Date(realValue).toLocaleDateString()
          }

          // NULO
          if (realValue == null) return '-'

          // COLUMNA CLICKEABLE
          if (isClickable && options?.linkTo) {
            return h(
              NuxtLink,
              {
                to: options.linkTo(row.original),
                class: 'text-primary underline cursor-pointer'
              },
              () => String(realValue)
            )
          }

          // DEFAULT
          return String(realValue)
        }
      }

      return column
    })
  )

  return { tableColumns }
}
