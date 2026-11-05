import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentRole } from '../auth.js'

import LoginView from '../views/Loginview.vue'
import BrandManagementView from '../views/BrandManagementView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    name: 'Brands',
    component: BrandManagementView,
    meta: { roles: ['admin', 'manager', 'viewer'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const role = getCurrentRole()

  if (to.path !== '/login' && (!token || !role)) {
    return { name: 'Login' }
  }

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    return { name: 'Login' }
  }
})

export default router
