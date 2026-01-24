export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = getCookie(event, 'access_token')
  return await $fetch('http://localhost:3000/api/articulos/index', {
    query: {
      expand: query.expand,
      page: query.page,
      limit: query.limit
    },
    headers: {
      authorization: token ?? ''
    }
  })
})
