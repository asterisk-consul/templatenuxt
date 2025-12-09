// /composables/apiService.ts
import { getApiToken } from './authTokens'
import type { ApiKey } from './authTokens'

/**
 * Nota: asume que en runtime config tenés public.apiBase1 y public.apiBase2
 * (ver sección de nuxt config más abajo)
 */

function baseUrlFor(api: ApiKey) {
  const config = useRuntimeConfig()
  return api === 'api1' ? config.public.apiBase1 : config.public.apiBase2
}

/* Fetch GET — devuelve ref<T> (useFetch) */
export async function fetchData<T>(
  endpoint: string,
  opts: { api: ApiKey }
) {
  const baseURL = baseUrlFor(opts.api)
  const token = getApiToken(opts.api)

  const headers: HeadersInit = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const { data, error } = await useFetch<T>(`${baseURL}${endpoint}`, {
    headers,
    server: false // cliente
  })

  if (error.value) throw error.value
  return data // ref<T>
}

/* POST usando $fetch — devuelve { data, status } */
export async function postData<T, B extends Record<string, any>>(
  endpoint: string,
  body: B,
  opts: { api: ApiKey }
) {
  const baseURL = baseUrlFor(opts.api)
  const token = getApiToken(opts.api)

  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  console.log('baseURL',baseURL)
  let status = 0
  const data = await $fetch<T>(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers,
    body,
    onResponse({ response }) {
      status = response.status
    }
  })

  return { data, status }
}

/* Services de login para cada API (pueden variar según tu backend) */
export async function loginApi1(username: string, password: string) {
  const config = useRuntimeConfig()
  return $fetch(`${config.public.apiBase1}/api/login`, {
    method: 'POST',
    body: { username, password }
  })
}

export async function loginApi2(username: string, password: string) {
  const config = useRuntimeConfig()
  return $fetch(`${config.public.apiBase2}/auth/login`, {
    method: 'POST',
    body: { username, password }
  })
}
