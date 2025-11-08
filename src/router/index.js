import { createRouter, createWebHistory } from 'vue-router'

import postRoutes from './postRoutes'
import nestedRoutes from './nestedRoutes'
import etcRoutes from './etcRoutes'
import playgroundRoutes from './playgroundRoutes'

import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  ...postRoutes,
  ...nestedRoutes,
  ...etcRoutes,
  ...playgroundRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
