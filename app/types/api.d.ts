// types/api.d.ts
declare global {
  interface DataApi {
    value: any
  }

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

  export interface ApiDolar {
    compra: number
    venta: number
    casa: string
    nombre: string
    moneda: string
    fechaActualizacion: string
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

  export interface ApiArticulosdata {
    value: ApiArticulos
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

  export interface ArticulosApiN {
    id: string
    internalcode: string
    externalcode: string
    nombre: string
    descrip: any
    categid: string
    instructivoid: any
    caracteristicas: any
    activo: boolean
    cantidadunidad: any
    puntorepo: any
    nivelobj: any
    cantminrepo: any
    imagen: any
    um: any
    ub: any
    isbom: boolean
    compraminima: any
    statusinicial: any
    impuestoalic: any
    isservice: boolean
    ischeque: boolean
    cuentacontableid: any
    isamedida: boolean
    articuloespec: any[]
    articuloprecio: any[]
    articulopreciohistorico: Articulopreciohistorico[]
    depositosarticulos: Depositosarticulo[]
    hijos: Hijo[]
    tipoarticulos: Tipoarticulo[]
    perfilesarticulos: any[]
    articulos_padre: ArticulosPadre[]
  }

  export interface Articulopreciohistorico {
    id: number
    articuloid: number
    categid: number
    precio: Precio
    changedate: Changedate
    factorconversion: number
  }

  export interface Precio {
    s: number
    e: number
    d: number[]
  }

  export interface Changedate {}

  export interface Depositosarticulo {
    depositos: Depositos
  }

  export interface Depositos {
    id: string
    descrip: string
  }

  export interface Hijo {
    id: string
    articuloid: string
    parentarticuloid: string
    cantidad: number
    compvariableid: any
    cuentacontableid: any
    ancho: any
    largo: any
  }

  export interface Tipoarticulo {
    id: number
    categid: string
    articuloid: string
  }

  export interface ArticulosPadre {
    id: string
    articuloid: string
    parentarticuloid: string
    cantidad: number
    compvariableid: any
    cuentacontableid: any
    ancho: any
    largo: any
  }
}

export {}
