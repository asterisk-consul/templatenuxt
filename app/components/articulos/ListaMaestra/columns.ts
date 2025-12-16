import { h, resolveComponent } from 'vue'
import type { CellContext } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

const UCheckbox = resolveComponent('UCheckbox')

export function createColumns(
  table: any,
  flatData: NodoArbol[],
  expanded: Set<string | number>,
  toggle: (id: string | number) => void,
  editar: (item: NodoArbol) => void,
  eliminar: (item: NodoArbol) => void,
  esTerminal: (code?: string | null) => boolean
): TableColumn<NodoArbol, unknown>[] {
  return [
    // ---------------- Checkbox de selección ----------------
    {
      id: 'select',
      header: () =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            table.toggleAllPageRowsSelected(!!value),
          'aria-label': 'Select all'
        }),
      cell: ({ row }: CellContext<NodoArbol, unknown>) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
            row.toggleSelected(!!value),
          'aria-label': 'Select row'
        })
    },

    // ---------------- Nombre del artículo ----------------
    {
      accessorKey: 'nombre',
      header: 'Artículo',
      cell: ({ row }: CellContext<NodoArbol, unknown>) => {
        const item = row.original
        const isTerm = esTerminal(item.internalcode)

        return h(
          'div',
          { class: 'flex items-center justify-between w-full group' },
          [
            h('div', { class: 'flex items-center' }, [
              // indent
              h('span', {
                style: { width: `${item.depth! * 1.5}rem` },
                class: 'inline-block'
              }),
              // drag handle
              item.parentId
                ? h(
                    'span',
                    { class: 'mr-2 cursor-move text-gray-400 select-none' },
                    '⋮⋮'
                  )
                : null,
              // toggle hijos
              item.hijos?.length
                ? h(
                    'button',
                    {
                      class:
                        'mr-2 px-2 py-1 rounded text-xs hover:bg-gray-100 transition-transform duration-300',
                      onClick: () => toggle(item.id)
                    },
                    [
                      h(
                        'span',
                        {
                          class: [
                            'inline-block transform transition-transform duration-300',
                            expanded.has(item.id) ? 'rotate-90' : 'rotate-0'
                          ]
                        },
                        '>'
                      )
                    ]
                  )
                : h('span', { class: 'mr-4' }),
              // nombre
              h(
                'span',
                { class: `font-medium ${isTerm ? 'text-blue-600' : ''}` },
                item.nombre
              ),
              // etiqueta terminal
              isTerm
                ? h(
                    'span',
                    { class: 'ml-2 px-1 text-xs bg-blue-100 rounded' },
                    'T'
                  )
                : null
            ]),
            // botones editar/eliminar
            h(
              'div',
              { class: 'opacity-0 group-hover:opacity-100 flex space-x-1' },
              [
                h(
                  'button',
                  {
                    class:
                      'text-sm px-1 py-0.5 border rounded hover:bg-gray-100',
                    onClick: () => editar(item)
                  },
                  'Editar'
                ),
                h(
                  'button',
                  {
                    class:
                      'text-sm px-1 py-0.5 border rounded hover:bg-gray-100',
                    onClick: () => eliminar(item)
                  },
                  'Eliminar'
                )
              ]
            )
          ]
        )
      }
    },

    // ---------------- Otros campos ----------------
    { accessorKey: 'internalcode', header: 'Código interno' },
    { accessorKey: 'externalcode', header: 'Código externo' },
    { accessorKey: 'cantidad', header: 'Cantidad' },

    {
      id: 'medidas',
      header: 'Medidas',
      cell: ({ row }: CellContext<NodoArbol, unknown>) => {
        const i = row.original
        if (!esTerminal(i.internalcode)) return ''
        return `${i.ancho ?? '-'} x ${i.largo ?? '-'}`
      }
    },

    {
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }: CellContext<NodoArbol, unknown>) => {
        const articulo = row.original.articulo
        if (!articulo?.tipoarticulos?.length) return ''
        return articulo.tipoarticulos[0].categid ?? ''
      }
    }
  ]
}
