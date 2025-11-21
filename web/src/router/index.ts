import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/servers/:name',
      name: 'Server',
      redirect: (to) => `/servers/${to.params.name}/overview`,
    },
    {
      path: '/servers/:name/overview',
      name: 'Overview',
      component: () => import('../views/server/Overview.vue'),
      meta: {
        title: 'Server Overview',
      },
    },
    {
      path: '/servers/:name/edit',
      name: 'CodeEditor',
      component: () => import('../views/server/CodeEditor.vue'),
      meta: {
        title: 'Server Editor',
      },
    },
    {
      path: '/servers/:name/console',
      name: 'Console',
      component: () => import('../views/server/Console.vue'),
      meta: {
        title: 'Server Console',
      },
    },
    {
      path: '/servers/:name/players',
      name: 'PlayerList',
      component: () => import('../views/server/PlayerList.vue'),
      meta: {
        title: 'Server Players',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title
  document.title = `Vue.js ${title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
