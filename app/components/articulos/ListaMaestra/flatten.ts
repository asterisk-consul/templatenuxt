// treeHelpers.ts
import type { Ref } from 'vue'

export function flatten(
  node: NodoArbol,
  flatData: Ref<NodoArbol[]>,
  expanded: Ref<Set<string | number>>,
  depth = 0,
  parentId: string | number | null = null
) {
  const copy = { ...node, depth, parentId, hijos: node.hijos ?? [] }
  flatData.value.push(copy)

  if (expanded.value.has(node.id)) {
    for (const child of copy.hijos) {
      flatten(child, flatData, expanded, depth + 1, node.id)
    }
  }
}

export function rebuild(
  listaMaestra: NodoArbol[],
  flatData: Ref<NodoArbol[]>,
  expanded: Ref<Set<string | number>>,
  rowSelection: Ref<Record<string, boolean>>
) {
  flatData.value = []
  listaMaestra.forEach((node) => flatten(node, flatData, expanded))

  // Inicializar rowSelection
  flatData.value.forEach((item) => {
    if (!(item.id in rowSelection.value)) {
      rowSelection.value[item.id] = false
    }
  })
}
