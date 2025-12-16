export function esTerminal(code?: string | null) {
  return !!code && code.trim().startsWith('T')
}
