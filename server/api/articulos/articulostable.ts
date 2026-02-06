export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const token = getCookie(event, 'api2_token')

  console.log('TOKEN:', token)
  console.log('API BASE:', config.apiBase2)

  return await $fetch(`${config.apiBase2}/articulos/index`, {
    query: {
      expand: query.expand,
      page: query.page,
      limit: query.limit
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
})
