// columns.ts
import type { CellContext } from '@tanstack/vue-table'

export function getColumns(resolveNombre: (id?: string | null) => string) {
  return [
    {
      accessorKey: 'categid',
      header: 'Categoría',
      cell: (ctx: CellContext<Articuloprecio, unknown>) => {
        const categoriaId = ctx.row.getValue('categid') as string | null
        return resolveNombre(categoriaId)
      }
    },
    {
      accessorKey: 'precio',
      header: 'Precio',
      cell: (ctx: CellContext<Articuloprecio, unknown>) => {
        const precio = ctx.row.getValue('precio') as number | null
        const formatted = new Intl.NumberFormat('us-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(precio))

        return h('div', { class: 'font-medium text-green-600' }, formatted)
      }
    },
    {
      accessorKey: 'changedate',
      header: 'Fecha de modificación',
      cell: (ctx: CellContext<Articuloprecio, unknown>) => {
        const value = ctx.row.getValue('changedate') as string | null
        if (!value) return '-'

        return new Date(value).toLocaleString('es-AR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
    },
    {
      id: 'action'
    }
  ]
}
