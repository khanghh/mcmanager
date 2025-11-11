import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import serveStatic from 'serve-static'
import path from 'path'

import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8081,
  },
  plugins: [
    {
      name: 'serve-custom-static',
      configureServer(server) {
        // Serve files from ./public under /static/
        server.middlewares.use(
          '/vscode',
          serveStatic(path.resolve(__dirname, './vscode-web/dist'))
        )
      },
    },
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
