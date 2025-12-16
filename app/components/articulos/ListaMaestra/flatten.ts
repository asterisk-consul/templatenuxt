export function flattenNode(
  node: NodoArbol,
  flatData: NodoArbol[],
  expanded: Set<string | number>,
  depth = 0,
  parentId: string | number | null = null
) {
  const copy = { ...node, depth, parentId, hijos: node.hijos ?? [] }
  flatData.push(copy)

  if (expanded.has(node.id)) {
    for (const child of copy.hijos) {
      flattenNode(child, flatData, expanded, depth + 1, node.id)
    }
  }
}

export function rebuildFlatData(
  listaMaestra: NodoArbol[],
  flatData: NodoArbol[],
  expanded: Set<string | number>
) {
  flatData.length = 0
  listaMaestra.forEach((node) => flattenNode(node, flatData, expanded))
}
