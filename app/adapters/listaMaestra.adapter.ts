// services/adapters/listaMaestra.adapter.ts

export function adaptListaMaestra(raw: any): NodoListaMaestra[] {
  if (!raw) return []

  // Caso 1: ya viene como array
  if (Array.isArray(raw)) {
    return raw.map(adaptNodo)
  }

  // Caso 2: viene un nodo raíz
  return [adaptNodo(raw)]
}

function adaptNodo(raw: any): NodoListaMaestra {
  return {
    id: String(raw.id),
    nombre: raw.nombre ?? '',
    internalcode: raw.internalcode ?? null,
    externalcode: raw.externalcode ?? null,
    cantidad: Number(raw.cantidad ?? 0),
    ancho: raw.ancho ?? null,
    largo: raw.largo ?? null,
    um: raw.um ?? null,
    ub: raw.ub ?? null,
    esTerminal: Boolean(raw.esTerminal),

    depositos: Array.isArray(raw.depositos)
      ? raw.depositos.map((d: any) => ({
          id: String(d.id),
          cantidad: Number(d.cantidad ?? 0),
          deposito: d.deposito ?? ''
        }))
      : [],

    categorias: Array.isArray(raw.categorias)
      ? raw.categorias.map((c: any) => ({
          id: String(c.id),
          name: c.name ?? ''
        }))
      : [],

    hijos: Array.isArray(raw.hijos) ? raw.hijos.map(adaptNodo) : []
  }
}
