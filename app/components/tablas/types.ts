export interface DataTableColumn {
  key: string
  label: string
  type?: 'text' | 'currency' | 'date' | 'boolean'
  sortable?: boolean
  filterable?: boolean
  visible?: boolean
  defaultVisible?: boolean
  width?: number
}

export interface DataTableMeta {
  page: number
  limit: number
  total: number
}

export interface ColumnState {
  key: string
  visible: boolean
}
