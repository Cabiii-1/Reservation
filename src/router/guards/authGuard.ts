import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

export async function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { isAuthenticated, userRole, suspense } = useAuth()

  try {
    // Wait for query resolution
    await suspense()

    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next({ name: 'Login' })
    }

    if (to.meta.guestOnly && isAuthenticated.value) {
      return next({ name: 'Dashboard' })
    }

    const allowedRoles = to.meta.roles as string[] | undefined
    if (allowedRoles && (!userRole.value || !allowedRoles.includes(userRole.value))) {
        return next({ name: 'Forbidden' })
      }
      

    next()
  } catch (err) {
    console.error('Error during auth guard:', err)
    next({ name: 'Login' })
  }
}
