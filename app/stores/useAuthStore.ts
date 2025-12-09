// /stores/authStore.ts
import { defineStore } from 'pinia'
import { setApiToken } from '@/composables/authTokens'
import { loginApi1, loginApi2 } from '@/composables/apiService'
import type { ApiKey } from '@/composables/authTokens'

export const useAuthStore = defineStore('auth', () => {
  // Cookies (independientes por API)
  const tokenApi1Cookie = useCookie<string | null>('api1_token')
  const tokenApi2Cookie = useCookie<string | null>('api2_token')
  const userData = ref<any>(null)

  // Restaurar tokens desde cookies al iniciar
  if (tokenApi1Cookie.value) setApiToken('api1', tokenApi1Cookie.value)
  if (tokenApi2Cookie.value) setApiToken('api2', tokenApi2Cookie.value)

  const isLogged = computed(() => !!tokenApi1Cookie.value || !!tokenApi2Cookie.value)

  async function login(username: string, password: string) {
    // Llamar a ambas APIs en paralelo; usar try/catch para manejar fallos
    try {
      const [res1, res2] = await Promise.all([
        loginApi1(username, password),
        loginApi2(username, password)
      ])

      userData.value = res2?.user ?? null
      
      // Asumo que cada response incluye access_token y expires_in (ajustar según API)
      const token1 = res1?.access_token ?? null
      const token2 = res2?.access_token ?? null

      setApiToken('api1', token1)
      setApiToken('api2', token2)

      tokenApi1Cookie.value = token1
      tokenApi2Cookie.value = token2

      return { res1, res2 }
    } catch (err) {
      // Si querés, podés limpiar parcialmente si uno falló
      throw err
    }
  }

  function logout() {
    setApiToken('api1', null)
    setApiToken('api2', null)

    tokenApi1Cookie.value = null
    tokenApi2Cookie.value = null
  }

  /**
   * Util: devolver token por api
   */
  function getToken(api: ApiKey) {
    return api === 'api1' ? tokenApi1Cookie.value : tokenApi2Cookie.value
  }

  return {
    login,
    logout,
    userData,
    isLogged,
    getToken
  }
})
