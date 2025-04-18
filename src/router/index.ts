// src/router/index.ts
import{ createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Lazy-loaded layouts & views
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const AuthLayout = () => import('@/layouts/AuthLayout.vue')

const LoginPage = () => import('@/modules/auth/views/LoginPage.vue')
const DashboardPage = () => import('@/modules/dashboard/views/DashboardPage.vue')
const ProfilePage = () => import('@/modules/user/views/ProfilePage.vue')
// const NotFound = () => import('@/views/NotFound.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfilePage,
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: { guestOnly: true },
      },
    ],
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: NotFound,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Example route guard (auth logic can be imported from composables/auth)
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'Dashboard' })
  }
  next()
})

export default router
