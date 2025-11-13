<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, inject } from 'vue'
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Message, MessageType, PtyBuffer } from '@/generated/message.js';
import { useWebsocket } from '@/composables/useWebsocket';
import axios from 'axios'
import { useConfig } from '@/composables/useConfig';
import { useToast } from '@/composables/useToast';

const terminalContainer = ref(null);
let term: Terminal | null = null;
let fitAddon: FitAddon | null = null;
let resizeObserver: ResizeObserver | null = null;
const encoder = new TextEncoder();
const config = useConfig()
const apiURL = config.value.apiURL

// Use WebSocket composable
const ws = useWebsocket()
const { status } = inject('serverStatus', { status: ref({ state: 'stopped' }) })
const isBusy = ref(false)
const isKilling = ref(false)
const toast = useToast()

const isServerStopped = computed(() => status.value.state === 'stopped')

function sendInput(data) {
  if (!ws.isConnected.value) return;
  const msg = Message.create({
    type: MessageType.PTY_INPUT,
    ptyBuffer: PtyBuffer.create({ data })
  });
  ws.send(msg);
}

function clearLogs() {
  if (term) {
    term.clear();
    fitAddon.fit();
  }
};

async function startServer() {
  if (isBusy.value) return
  isBusy.value = true
  try {
    await axios.post(apiURL + '/api/mc/start')
    toast.success('Server started successfully')
  } catch (err) {
    toast.error(`Failed to start server: ${err.response?.data?.message || err.message}`)
  } finally {
    isBusy.value = false
  }
}

async function stopServer() {
  if (isBusy.value) return
  isBusy.value = true
  try {
    await axios.post(apiURL +'/api/mc/stop')
    toast.success('Server stopped successfully')
  } catch (err) {
    toast.error(`Failed to stop server: ${err.response?.data?.message || err.message}`)
  } finally {
    isBusy.value = false
  }
}

async function killServer() {
  if (isKilling.value) return
  isKilling.value = true
  try {
    await axios.post(apiURL +'/api/mc/kill')
    toast.success('Server killed successfully')
  } catch (err) {
    toast.error(`Failed to kill server: ${err.response?.data?.message || err.message}`)
  } finally {
    isKilling.value = false
  }
}

async function restartServer() {
  if (isKilling.value) return
  isKilling.value = true
  try {
    await axios.post(apiURL + '/api/mc/restart')
    toast.success('Server restarted successfully')
  } catch (err) {
    toast.error(`Failed to restart server: ${err.response?.data?.message || err.message}`)
  } finally {
    isKilling.value = false
  }
}

onMounted(() => {
  // Set up event listeners for WebSocket messages
  ws.on(MessageType.PTY_OUTPUT, (msg) => {
    if (msg.ptyBuffer && term) {
      term.write(msg.ptyBuffer.data);
    }
  });

  ws.on(MessageType.ERROR, (msg) => {
    toast.error('WebSocket error: ' + msg.error.message);
  });

  term = new Terminal({
    convertEol: true,
    cursorBlink: true,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 13,
    theme: { background: '#111111' }
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminalContainer.value);

  // Fit terminal and setup resize observer
  resizeObserver = new ResizeObserver(() => {
    fitAddon.fit();
  });
  resizeObserver.observe(terminalContainer.value);
  fitAddon.fit();

  // Connect terminal input to WebSocket
  term.onData((data) => {
    sendInput(encoder.encode(data));
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (term) {
    term.dispose();
  }
});

</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div
      class="terminal-header bg-dark px-5 py-3.5 border-b border-border border-gray-500 flex justify-between items-center">
      <div class="terminal-title flex items-center gap-2.5 font-medium">
        <TerminalIcon class="w-4 h-4" />
        <span>Server Console</span>
      </div>
      <div class="terminal-controls flex gap-2.5">

        <button
          v-if="!isServerStopped"
          class="btn btn-stop px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all font-medium text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isBusy"
          @click="stopServer">
          <SquareIcon class="w-4 h-4 lucide-solid" />
          <span>Stop</span>
        </button>
        <button
          v-else
          class="btn btn-start px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all font-medium text-sm text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isBusy"
          @click="startServer">
          <PlayIcon class="w-4 h-4 lucide-solid" />
          <span>Start</span>
        </button>
        <button
          v-if="!isServerStopped"
          class="btn btn-stop px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all font-medium text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isKilling"
          @click="killServer">
          <XIcon class="w-4 h-4" />
          <span>Kill</span>
        </button>
        <button
          v-if="!isServerStopped"
          class="btn btn-restart px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all font-medium text-sm bg-secondary text-white hover:bg-[#2c4a6b]"
          :disabled="isBusy"
          @click="restartServer">
          <RotateCcwIcon class="w-4 h-4" />
          <span>Restart</span>
        </button>
        <button
          class="btn btn-clear px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all font-medium text-sm bg-secondary text-white hover:bg-[#2c4a6b]"
          @click="clearLogs">
          <Trash2Icon class="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
    <div ref="terminalContainer" class="terminal-container"></div>
  </div>
</template>

<style scoped>
.terminal-container {
  /* allow this container to take remaining space in the column flex layout */
  flex: 1 1 0%;
  min-height: 0;
  /* allow children to shrink properly in flexbox */
  position: relative;
}

/* Ensure xterm elements fill the container when possible */
.terminal-container .xterm,
.terminal-container .xterm-viewport,
.terminal-container .xterm-screen,
.terminal-container .xterm-rows {
  height: 100% !important;
}

/* make the underlying canvas/textarea fill the area too */
.terminal-container .xterm-canvas,
.terminal-container .xterm-text-layer,
.terminal-container .xterm-viewport {
  height: 100% !important;
}

/* Make Lucide icons appear solid/filled */
.lucide-solid {
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 0;
}
</style>
