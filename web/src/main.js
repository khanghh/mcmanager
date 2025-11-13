import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useConfig, loadConfig } from '@/composables/useConfig'
import { initWebsocket } from '@/composables/useWebsocket'
import { MessageType, ServerState } from '@/generated/message.js'
import axios from 'axios'
import 'vue3-toastify/dist/index.css'

// Import and register Lucide icons globally
import {
  Box,
  Users,
  Folder,
  Terminal,
  FileCode,
  File,
  RotateCcw,
  Save,
  Trash2,
  Square,
  Send,
  Play,
  Bomb,
  X
} from 'lucide-vue-next'

const app = createApp(App)

// Register icons globally
app.component('BoxIcon', Box)
app.component('UsersIcon', Users)
app.component('FolderIcon', Folder)
app.component('TerminalIcon', Terminal)
app.component('FileCodeIcon', FileCode)
app.component('FileIcon', File)
app.component('RotateCcwIcon', RotateCcw)
app.component('SaveIcon', Save)
app.component('Trash2Icon', Trash2)
app.component('SquareIcon', Square)
app.component('SendIcon', Send)
app.component('PlayIcon', Play)
app.component('BombIcon', Bomb)
app.component('XIcon', X)

app.use(router)

// Global server status state
const serverStatus = ref({
  state: 'stopped', //  'stopped', 'running' | 'stopping' |
  onlinePlayers: 0,
  maxPlayers: 0,
})

function updateServerStatus(payload) {
  if (!payload || typeof payload !== 'object') return 
  console.log('Updating server status with payload:', payload)
  
  // Handle different payload structures
  let state = serverStatus.value.state
  if (payload.state !== undefined) {
    // Handle numeric ServerState enum (0=STOPPED, 1=RUNNING, 2=STOPPING)
    if (typeof payload.state === 'number') {
      switch (payload.state) {
        case 1: state = 'running'; break;
        case 2: state = 'stopping'; break;
        default: state = 'stopped'; break;
      }
    } else {
      state = String(payload.state).toLowerCase()
    }
  } else if (payload.status) {
    state = String(payload.status).toLowerCase()
  }
  
  const online = payload.onlinePlayers ?? payload.online ?? payload.playersOnline ?? payload.players ?? serverStatus.value.onlinePlayers
  const max = payload.maxPlayers ?? payload.max ?? payload.playersMax ?? serverStatus.value.maxPlayers
  
  const newStatus = {
    state,
    onlinePlayers: Number.isFinite(Number(online)) ? Number(online) : serverStatus.value.onlinePlayers,
    maxPlayers: Number.isFinite(Number(max)) ? Number(max) : serverStatus.value.maxPlayers,
  }
  serverStatus.value = newStatus
}

// Fetch initial server status from API
async function fetchServerStatus(apiURL) {
  if (!apiURL) return
  
  try {
    const response = await axios.get(`${apiURL}/api/mc/status`)
    console.log('Server status:', response.data)
    if (response.data?.data) {
      updateServerStatus(response.data.data)
    }
  } catch (error) {
    console.warn('Failed to fetch initial server status:', error)
    // Keep status as 'unknown' if fetch fails
  }
}

// Initialize global config and WebSocket
async function initializeApp() {
  // Initialize and then access config synchronously
  const config = await loadConfig()

  // Calculate WebSocket URL
  const baseUrl = config.value?.apiURL || 'http://localhost:3000'
  const wsUrl = baseUrl.replace(/^https?/, match => match === 'https' ? 'wss' : 'ws') + '/ws'

  // Fetch initial server status
  await fetchServerStatus(baseUrl)

  // Initialize singleton WebSocket once
  const websocket = initWebsocket(wsUrl)

  // Set up WebSocket listener for server status updates
  if (MessageType && typeof MessageType.SERVER_STATUS !== 'undefined') {
    websocket.on(MessageType.SERVER_STATUS, (msg) => {
      console.log('Received WebSocket server status message:', msg)
      // The protobuf message structure has serverStatus field
      if (msg?.serverStatus) {
        updateServerStatus(msg.serverStatus)
      } else {
        updateServerStatus(msg)
      }
    })
  }

  // Provide WebSocket and server status globally
  app.provide('websocket', websocket)
  app.provide('serverStatus', { status: serverStatus, updateStatus: updateServerStatus })

  app.mount('#app')
}

initializeApp()
