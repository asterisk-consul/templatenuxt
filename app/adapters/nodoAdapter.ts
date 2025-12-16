// types.ts
export interface DepositoAPI {
  id: string
  cantidad: number
  deposito: string
}

export interface CategoriaAPI {
  id: string
  name: string
}

export interface NodoAPI {
  id?: string
  nombre?: string
  internalcode?: string
  externalcode?: string
  um?: string | null
  ub?: number | null
  cantidad?: number
  ancho?: number | null
  largo?: number | null
  esTerminal?: boolean
  depositos?: DepositoAPI[]
  categorias?: CategoriaAPI[]
  hijos?: NodoAPI[]
}

// Adaptador recursivo
export function adaptNodoAPI(nodo: any): NodoListaMaestra {
  return {
    id: nodo.id ? BigInt(nodo.id) : 0n,
    nombre: nodo.nombre ?? '',
    internalcode: nodo.internalcode ?? null,
    externalcode: nodo.externalcode ?? null,
    cantidad: nodo.cantidad ?? 1,
    ancho: nodo.ancho ?? null,
    largo: nodo.largo ?? null,
    um: nodo.um ?? null,
    ub: nodo.ub ?? null,
    esTerminal: nodo.esTerminal ?? false,
    depositos:
      nodo.depositos?.map((d: any) => ({
        id: BigInt(d.id),
        cantidad: d.cantidad,
        deposito: d.deposito
      })) ?? [],
    categorias:
      nodo.categorias?.map((c: any) => ({
        id: BigInt(c.id),
        name: c.name
      })) ?? [],
    hijos: nodo.hijos?.map(adaptNodoAPI) ?? []
  }
}
