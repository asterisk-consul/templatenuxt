import type { ApiKey } from './authTokens'
import { getApiToken } from './authTokens'

function baseUrlFor(api: ApiKey) {
  const config = useRuntimeConfig()
  return api === 'api1' ? config.public.apiBase1 : config.public.apiBase2
}

export async function apiFetch<T>(
  endpoint: string,
  opts: {
    api: ApiKey
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    query?: Record<string, any>
    body?: unknown
  }
): Promise<T> {
  const baseURL = baseUrlFor(opts.api)
  const token = getApiToken(opts.api)

  const response = await $fetch(endpoint, {
    baseURL,
    method: opts.method ?? 'GET',
    query: opts.query,
    // 👇 cast encapsulado y seguro
    body: opts.body as Record<string, any> | undefined,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  return response as T
}
