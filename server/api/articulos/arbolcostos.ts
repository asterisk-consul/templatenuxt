export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')

  // console.log('TOKEN:', token)
  // console.log('API BASE:', config.apiBase2)

  return await $fetch(`${config.apiBase2}/articulos/arbol-costos/1118`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
})
