export function normalizarLabel(key: string) {
  return (
    key
      .split('.')
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || key
  )
}
