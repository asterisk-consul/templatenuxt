// types/api.d.ts
declare global {
  interface ApiResponse<T = any> {
    status: number
    data: ApiRegistroCabList | T
  }
  interface ApiRegsitroCab {
    id: number
    status: number
  }
  export interface ApiRegistroCabList {
    cols: string[]
    rows: Row[]
    total: number
  }

  export interface Row {
    id: number
    descrip: string
    fecha: string
    fechacompromiso: string
    fechavencimiento: any
    creationdate: string
    clientid: number
    clientname: string
    totalprecio: number
    totalimpuestos: number
    referenciatexto: string
    vendedor: any
    vendedorid: any
    parteinteresadatipoid: any
    procesoid: any
    puestotrabajoid: any
    auditor: any
    auditorid: any
    ejecutor: number
    ejecutorid: string
    total: number
  }
  export type TypeApiDeposito = ApiDeposito[]

  export interface ApiDeposito {
    id: number
    descrip: string
    activo: boolean
    parentid?: number
    categid: number
    categoria: Categoria
    perfilid: any
    parentDeposito?: ParentDeposito
  }

  export interface Categoria {
    id: number
    name: string
    grupo: string
    parentid: any
    orden: any
    procparentid: any
    macroparentid: any
    notas: any
    valor: any
  }

  export interface ParentDeposito {
    id: number
    descrip: string
    activo: boolean
    parentid?: number
    categid: number
    perfilid: any
  }

  export interface ApiArticulos {
    cols: string[]
    showableColumns: string[]
    total: number
    rows: RowArticulos[]
  }

  export interface RowArticulos {
    'articulos.id': number
    'articulos.internalcode': string
    'articulos.externalcode'?: string
    'articulos.nombre': string
    'articulos.descrip'?: string
    'articulos.categid': number
    'articulos.statusinicial': any
    'articulos.instructivoid': any
    'articulos.caracteristicas'?: string
    'articulos.activo'?: boolean
    'articulos.cantidadunidad': any
    'articulos.puntorepo': any
    'articulos.nivelobj': any
    'articulos.cantminrepo': any
    'articulos.imagen': any
    'articulos.um'?: string
    'articulos.impuestoalic'?: number
    'articulos.isservice': boolean
    'articulos.ischeque'?: boolean
    'articulos.isamedida': boolean
    'articulos.cuentacontableid': any
    'categorias.id': number
    'categorias.name': string
    'categorias.grupo': string
    'categorias.parentid'?: number
    'categoriaPadre.id'?: number
    'categoriaPadre.name'?: string
    'categoriaPadre.grupo'?: string
    'categoriaPadre.parentid'?: number
    'categoriaAbuelo.id'?: number
    'categoriaAbuelo.name'?: string
    'categoriaAbuelo.grupo'?: string
    'categoriaAbuelo.parentid'?: number
  }
}

export {}
