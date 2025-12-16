// columnsListaMaestra.ts
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

interface ColumnProps {
  editingNode: any
  handleDragStart: (e: DragEvent, node: NodoListaMaestra) => void
  handleDragEnd: () => void
  handleDragOver: (e: DragEvent, node: NodoListaMaestra) => void
  handleDragLeave: () => void
  handleDrop: (e: DragEvent, node: NodoListaMaestra) => void
  handleAddChild: (node: NodoListaMaestra) => void
  handleEdit: (node: NodoListaMaestra) => void
  handleDelete: (node: NodoListaMaestra) => void
  disabled?: boolean
}

export const getColumnsListaMaestra = (
  props: ColumnProps
): TableColumn<NodoListaMaestra>[] => [
  {
    accessorKey: 'drag',
    cell: (row) => {
      if (props.disabled || row.level === 0) return null
      return h(
        'div',
        {
          class: 'cursor-move p-1 hover:bg-gray-200 rounded',
          draggable: true,
          onDragstart: (e: DragEvent) => props.handleDragStart(e, row),
          onDragend: props.handleDragEnd
        },
        '⋮⋮'
      )
    }
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: (row) => {
      const indent = row.level * 24
      return h(
        'div',
        {
          style: { paddingLeft: `${indent}px` },
          class: 'flex items-center gap-2'
        },
        [
          h('span', { class: 'font-medium' }, row.nombre),
          row.esTerminal &&
            h(
              'span',
              {
                class:
                  'text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded'
              },
              'Terminal'
            )
        ]
      )
    }
  },
  {
    accessorKey: 'cantidad',
    header: 'Cantidad',
    cell: (row) => {
      return h(
        'span',
        { class: 'text-gray-700' },
        row.cantidad?.toString() ?? '1'
      )
    }
  },
  {
    accessorKey: 'internalcode',
    header: 'Código',
    cell: (row) =>
      h(
        'span',
        { class: 'text-gray-600 font-mono text-sm' },
        row.internalcode ?? '-'
      )
  },
  {
    accessorKey: 'acciones',
    header: 'Acciones',
    cell: (row) => {
      if (props.disabled) return null
      return h('div', { class: 'flex gap-1' }, [
        h(
          'button',
          { onClick: () => props.handleAddChild(row), class: 'text-green-600' },
          '➕'
        ),
        h(
          'button',
          { onClick: () => props.handleEdit(row), class: 'text-blue-600' },
          '✏️'
        ),
        row.level > 0 &&
          h(
            'button',
            { onClick: () => props.handleDelete(row), class: 'text-red-600' },
            '🗑️'
          )
      ])
    }
  }
]
