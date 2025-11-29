export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // Previene error si el store no está listo
  if (!auth || !auth.user) return

  const user = auth.user

  if (!user) return navigateTo('/login')
})
