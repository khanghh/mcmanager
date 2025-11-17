import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/overview',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/bungee',
      name: 'Bungee',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/hub',
      name: 'Hub',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
     {
      path: '/skyblock',
      name: 'SkyBlock',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
     {
      path: '/fractions',
      name: 'Fractions',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
