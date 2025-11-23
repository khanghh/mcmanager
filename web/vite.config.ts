import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    {
      name: 'vscode-index-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/vscode' || req.url === '/vscode/') {
            const indexPath = resolve(__dirname, 'public/vscode/index.html')
            try {
              const html = readFileSync(indexPath, 'utf-8')
              res.setHeader('Content-Type', 'text/html')
              res.end(html)
              return
            } catch (err) {
              console.error('Error loading vscode index.html:', err)
            }
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
