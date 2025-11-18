export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path)) return

  const token = localStorage.getItem('auth_token')
  if (!token) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})