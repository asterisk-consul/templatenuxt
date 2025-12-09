// /composables/authTokens.ts
import { reactive } from 'vue'

export type ApiKey = 'api1' | 'api2'

export const authTokens = reactive<Record<ApiKey, string | null>>({
  api1: null,
  api2: null
})

export function setApiToken(api: ApiKey, token: string | null) {
  authTokens[api] = token
}

export function getApiToken(api: ApiKey) {
  return authTokens[api]
}
