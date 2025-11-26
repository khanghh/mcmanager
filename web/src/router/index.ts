import { createRouter, createWebHistory } from 'vue-router'
import { useConfig } from '@/composables/useConfig'

const config = useConfig()

const serverRoutes = config.value?.servers.map((server) => ({
  path: `/servers/${server.name.toLowerCase()}`,
  name: `${server.name}`,
  component: () => import('../views/server/Dashboard.vue'),
  meta: {
    title: `${server.name}`,
  },
})) || []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/BlankPage.vue'),
      meta: {
        title: 'Test',
      },
    },
    {
      path: '/overview',
      name: 'Overview',
      component: () => import('../views/Overview.vue'),
      meta: {
        title: 'Overview',
      },
    },
    ...serverRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/errors/NotFound.vue'),
      meta: {
        title: '404 Not Found',
      },
    },
  ],
})

export default router
