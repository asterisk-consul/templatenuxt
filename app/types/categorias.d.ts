export interface Categoria {
  id: string // BIGINT → string
  name: string
  grupo: string
  macroparentid: string | null
  parentid: string | null
  notas: string
  orden: number
  valor: number
  procparentid: string | null
}
