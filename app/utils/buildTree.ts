// utils/buildTree.ts
export function buildArticuloTree(items: any[]) {
  const map = new Map()

  // Inicializar nodos
  for (const item of items) {
    map.set(item.articuloid, { ...item, children: [] })
  }

  const roots = []

  for (const item of items) {
    const node = map.get(item.articuloid)

    if (item.parentarticuloid && map.has(item.parentarticuloid)) {
      map.get(item.parentarticuloid).children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}
