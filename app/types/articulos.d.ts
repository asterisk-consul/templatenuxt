// types/articulo.d.ts
declare global {
  interface ArticuloResponse {
    status: number
    data: Articulo
  }

  interface Camion {
    patente: string
  }

  interface Articulo {
    activo: boolean
    articuloprecios: Articuloprecio[]
    articulosDepositos: ArticulosDeposito[]
    categid: number
    categoria: Categoria2
    categoriaPadre: CategoriaPadre
    cuentacontable: Cuentacontable
    id: number
    internalcode: string
    isamedida: boolean
    ischeque: boolean
    isservice: boolean
    nombre: string
    tipoarticuloid: number[]
    tipos: Tipo[]
  }

  interface Categoria {
    id: number
    name: string
  }

  interface Categoria2 {
    grupo: string
    id: number
    name: string
    parentid: number
  }

  interface CategoriaPadre {
    grupo: string
    id: number
    name: string
  }

  interface Articuloprecio {
    articuloid: number
    categid: number
    changedate: string
    factorconversion: number
    id: number
    precio: number
  }
  interface ArticuloprecioForm {
    id?: number
    articuloid?: number
    categid: string | undefined
    precio: number
    factorconversion: number
    changedate: string
  }

  interface ArticulosDeposito {
    articuloid: number
    cantcomprometida: number
    cantidad: number
    cantminrepo: number
    canttransito: number
    compraminima: number
    deposito: Deposito
    depositoid: number
    id: number
    nivelobj: number
    permitenegativo: boolean
    puntorepo: number
  }

  interface Deposito {
    activo: boolean
    descrip: string
    id: number
  }

  interface Tipo {
    articuloid: number
    categid: number
    id: number
  }

  interface ArbolCostosNodo {
    id: bigint
    nombre: string
    precioUnitario: number
    cantidad: number
    costoTotal: number
    hijos: ArbolCostosNodo[]
  }

  type NodoListaMaestra = {
    id: bigint
    nombre: string
    internalcode: string | null
    externalcode: string | null
    cantidad: number
    ancho: number | null
    largo: number | null
    um: string | null
    ub: number | null
    esTerminal: boolean
    depositos?: {
      id: bigint
      cantidad: number
      deposito: string
    }[]

    categorias?: {
      id: bigint
      name: string
    }[]

    hijos: NodoListaMaestra[]
  }
}

export {}
