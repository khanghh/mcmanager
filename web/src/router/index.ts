import { createRouter, createWebHistory } from 'vue-router'
import { useConfig, loadConfig } from '@/composables/useConfig'


await loadConfig()
const config = useConfig()

const serverRoutes = config.value?.servers.flatMap((server) => {
  const name = server.name.toLowerCase()
  return [
    {
      path: `/servers/${name}/overview`,
      name: `${server.name}Overview`,
      component: () => import('../views/server/Overview.vue'),
      meta: {
        title: `${server.name} Overview`,
      },
    },
    {
      path: `/servers/${name}/editor`,
      name: `${server.name}Editor`,
      component: () => import('../views/server/CodeEditor.vue'),
      meta: {
        title: `${server.name} Editor`,
      },
    },
    {
      path: `/servers/${name}/console`,
      name: `${server.name}Console`,
      component: () => import('../views/server/Console.vue'),
      meta: {
        title: `${server.name} Console`,
      },
    },
  ]
}) || []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Test',
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    ...serverRoutes,
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title
  document.title = `Vue.js ${title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
