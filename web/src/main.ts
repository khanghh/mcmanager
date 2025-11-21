import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { loadConfig } from '@/composables/useConfig'
import { initWebsocket } from '@/composables/useWebsocket'
import InternalServerError from '@/views/Errors/InternalServer.vue'

async function initializeApp() {
  let config
  try {
    config = await loadConfig()
  } catch (err) {
    console.error('Failed to load config:', err)
    const errorApp = createApp(InternalServerError, {
      errorMessage: `Failed to load application configuration: ${err instanceof Error ? err.message : 'Unknown error'}`
    })
    errorApp.mount('#app')
    return
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  let wsUrl = `${protocol}//${window.location.host}/ws`;
  if (import.meta.env.DEV) {
    wsUrl = 'ws://localhost:8081/ws';
  }
  await initWebsocket(wsUrl);

  const app = createApp(App)
  app.use(router)
  app.use(VueApexCharts)
  app.mount('#app')
}

initializeApp()
