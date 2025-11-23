<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, type Ref } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { MessageType, Message, CmdConnect, Unsubscribe } from "@/generated/message";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import {
  PhHardDriveIcon,
  PhPlayIcon,
  PhStopIcon,
  PhXIcon,
  PhCpuIcon,
  PhMemoryIcon,
  PhArrowClockwiseIcon,
  PhTrashIcon,
  PhPaperPlaneRightIcon,
  PhUsersThreeIcon,
  PhClockIcon,
} from "@/icons";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { useApi, ServerState, ApiError } from "@/composables/useApi";
import { useWebsocket, UseWebsocket } from "@/composables/useWebsocket";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const api = useApi();
const toast = useToast();

const serverName = (route.params.name as string) || route.path.split('/')[2];

// data variables
const terminalContainer = ref(null);
const serverState: Ref<ServerState | null> = ref(null);
const command: Ref<string> = ref("");
const commandInput: Ref<HTMLInputElement | null> = ref(null);
const connected: Ref<boolean> = ref(false);
const autoScroll: Ref<boolean> = ref(true);
const notFound: Ref<boolean> = ref(false);
const serverStatus: Ref<string> = ref("unknown");
const uptime: Ref<number> = ref(0);
let term!: Terminal;
let fitAddon!: FitAddon;
let ws!: UseWebsocket;
let fetchStateTimer!: number;
let uptimeTimer!: number;

// computed
const isStopped = computed(() => serverState.value?.status === "stopped" || serverState.value?.status === "unknown");
const isRunning = computed(() => serverState.value && serverState.value.status === "running");

const statusBadgeVariant = computed(() => {
  if (!serverStatus.value) return "secondary";
  if (serverStatus.value === "running") return "success";
  if (serverStatus.value === "stopping") return "warning";
  if (serverStatus.value === "stopped") return "danger";
  return "secondary"
});

const statusDotClasses = computed(() => {
  if (!serverStatus.value) return "bg-gray-500";
  if (serverStatus.value === "running") return "bg-green-500";
  if (serverStatus.value === "stopping") return "bg-yellow-500";
  if (serverStatus.value === "stopped") return "bg-red-500";
  return "bg-gray-500"
});

// Format helpers
const formatBytes = (bytes: number | undefined) => {
  if (bytes === undefined) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUptime = (seconds: number | undefined) => {
  if (!seconds) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const cpuPercentage = computed(() => {
  if (!serverState.value?.cpuUsage) return 0;
  return Math.round(serverState.value.cpuUsage * 100) / 100;
});

const cpuCount = computed(() => serverState.value?.cpuLimit);

const memoryPercentage = computed(() => {
  if (!serverState.value?.memoryUsage || !serverState.value?.memoryLimit) return 0;
  return Math.min(Math.round((serverState.value.memoryUsage / serverState.value.memoryLimit) * 100), 100);
});

const diskPercentage = computed(() => {
  if (!serverState.value?.diskUsage || !serverState.value?.diskSize) return 0;
  return Math.min(Math.round((serverState.value.diskUsage / serverState.value.diskSize) * 100), 100);
});

const initTerminal = () => {
  if (!terminalContainer.value) return;
  term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: "#09090b",
      foreground: "#f4f4f5",
      cursor: "#f4f4f5",
      selectionBackground: "#3f3f46",
    },
    scrollback: 100,
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminalContainer.value);
  fitAddon.fit();
};

// Action helpers using API
const startServer = async () => {
  try {
    await api.startServer(serverName);
    toast.info(`${serverName} has been started`);
  } catch (e) {
    toast.error(`${serverName} failed to start: ${e}`);
  }
};

const stopServer = async () => {
  try {
    serverStatus.value = "stopping";
    await api.stopServer(serverName);
    toast.info(`${serverName} has been stopped`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to stop server ${serverName}: ${(err as ApiError)?.message || err}`)
  }
};

const restartServer = async () => {
  try {
    await api.restartServer(serverName);
    toast.info(`${serverName} has been restarted`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to restart server ${serverName}: ${(err as ApiError)?.message || err}`)
  }
};

const killServer = async () => {
  try {
    await api.killServer(serverName);
    toast.info(`${serverName} has been stopped`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to kill server ${serverName}: ${(err as ApiError)?.message || err}`)
  }
};

const clearConsole = () => {
  term.clear();
  fitAddon.fit();
};

const sendCommand = async () => {
  if (!command.value.trim() || notFound.value) return;
  try {
    await api.sendCommand(serverName, command.value.trim());
    command.value = '';
  } catch (e) {
    toast.error(`${serverName} failed to send command: ${e}`);
  }
};

const quickCommands = ["help", "list", "stop", "reload"] as const;
const applyQuickCommand = (cmd: string) => {
  command.value = cmd;
  // Focus input for immediate editing/sending
  try { commandInput.value?.focus(); } catch (_) { /* noop */ }
};

const fetchServerState = async () => {
  try {
    serverState.value = await api.getServerState(serverName);
    notFound.value = false;
    serverStatus.value = serverState.value.status;
    if (serverState.value.uptimeSec !== undefined) {
      uptime.value = serverState.value.uptimeSec;
    }
  } catch {
    notFound.value = true;
    serverStatus.value = "unknown"
  }
}

onMounted(async () => {
  // Load server state first; if not found show 404 and bail out
  await fetchServerState();
  if (notFound.value) return;

  initTerminal();
  window.addEventListener("resize", () => {
    fitAddon.fit();
  });

  // connection events
  ws = useWebsocket();
  ws.onopen(() => {
    connected.value = true;
    ws.send(Message.create({
      type: MessageType.CMD_CONNECT,
      cmdConnect: CmdConnect.create({ id: serverName })
    }))
  });
  ws.onclose(() => { connected.value = false; });

  ws.onmessage((msg) => {
    if (msg.type === MessageType.ERROR) {

    } else if (msg.type === MessageType.CMD_OUTPUT) {
      if (msg.cmdOutput && term) {
        const text = new TextDecoder().decode(msg.cmdOutput.data);
        term.write(text);
        if (autoScroll.value) {
          try { term?.scrollToBottom?.(); } catch (_) { }
        }
      }
    } else if (msg.type === MessageType.CMD_STATUS) {
      serverStatus.value = msg.cmdStatus.status;
      fetchServerState();
    }
  });

  fetchStateTimer = window.setInterval(fetchServerState, 10000);
  uptimeTimer = window.setInterval(() => {
    if (isRunning.value) {
      uptime.value++;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (fetchStateTimer) clearInterval(fetchStateTimer);
  if (uptimeTimer) clearInterval(uptimeTimer);
  if (notFound.value) return;
  window.removeEventListener("resize", () => {
    fitAddon.fit();
  });
  ws.send(Message.create({
    type: MessageType.UNSUBSCRIBE,
    unsubscribe: Unsubscribe.create({ topic: `servers:${serverName}` })
  }));
  term.dispose();
});

const breadcrumbPath = computed(() => ["servers", serverName, "Server Console"]);
</script>
<template>
  <AdminLayout>
    <PageBreadcrumb :path="breadcrumbPath" />
    <div
      class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white first-letter:uppercase">{{ serverName }}</h1>
          <Badge :variant="statusBadgeVariant">
            <span :class="['h-2 w-2 rounded-full', statusDotClasses]"></span>
            <span class="first-letter:uppercase">{{ serverStatus }}</span>
          </Badge>
        </div>
        <div class="flex items-center gap-3">
          <Badge>
            <PhUsersThreeIcon weight="fill" />
            <span>Online: <strong class="ml-1">{{ isRunning ? '0 / 0' : '0 / 0' }}</strong></span>
          </Badge>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- CPU Card -->
          <div
            class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</h3>
              <div
                class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <PhCpuIcon class="w-5 h-5" />
              </div>
            </div>
            <span class="flex items-end justify-between">
              <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ cpuPercentage }}%</p>
              <p class="text-md text-gray-500 dark:text-gray-400 mb-2 text-right">
                <template v-if="cpuCount !== undefined">Cores: {{ cpuCount }}</template>
                <template v-else>Cores: ?</template>
              </p>
            </span>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(cpuPercentage, 100)}%` }"></div>
            </div>
          </div>

          <!-- Memory Card -->
          <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</h3>
              <div
                class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <PhMemoryIcon class="w-5 h-5" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ formatBytes(serverState?.memoryUsage) }} / {{ serverState?.memoryLimit === 0 ? 'Unlimited' :
                formatBytes(serverState?.memoryLimit) }}</p>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${memoryPercentage}%` }">
              </div>
            </div>
          </div>

          <!-- Disk Card -->
          <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Disk Usage</h3>
              <div
                class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <PhHardDriveIcon class="w-5 h-5" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              <template v-if="serverState?.diskUsage !== undefined && serverState?.diskSize !== undefined">
                {{ formatBytes(serverState.diskUsage) }} / {{ formatBytes(serverState.diskSize) }}
              </template>
              <template v-else>
                0 B / 0 B
              </template>
            </p>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${diskPercentage}%` }">
              </div>
            </div>
          </div>

          <!-- Uptime Card -->
          <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
              <div
                class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <PhClockIcon class="w-5 h-5" />
              </div>
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ formatUptime(uptime) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Since last restart</p>
          </div>
        </div>

        <!-- Console Card -->
        <div
          class="flex flex-col rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800 shadow-sm overflow-hidden">
          <div
            class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <div class="flex items-center gap-2 pl-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">Server Console</h3>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-3">
                <Button v-if="isStopped" @click="startServer" size="md" variant="primary">
                  <PhPlayIcon weight="fill" />
                  Start
                </Button>
                <template v-else>
                  <Button v-if="!isStopped"
                    @click="stopServer" :disabled="serverStatus === 'stopping'" size="md" variant="danger">
                    <PhStopIcon weight="fill" />
                    Stop
                  </Button>
                  <Button v-if="!isStopped" @click="restartServer" size="md" variant="primary" soft outline>
                    <PhArrowClockwiseIcon />
                    Restart
                  </Button>
                  <Button v-if="!isStopped"
                    @click="killServer" size="md" variant="danger" soft outline>
                    <PhXIcon />
                    Kill
                  </Button>
                </template>
              </div>
              <div class="flex items-center gap-3">
                <Button @click="clearConsole" size="md" variant="secondary" outline>
                  <PhTrashIcon />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <!-- Terminal -->
          <div class="h-[800px]">
            <div ref="terminalContainer" class="h-full w-full"></div>
          </div>

          <!-- Command Input -->
          <div class="border-t border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <div class="relative">
              <input ref="commandInput" v-model="command" @keydown.enter="sendCommand" type="text"
                placeholder="Type a command..."
                class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-[100px] text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:placeholder:text-gray-400" />
              <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <Button @click="sendCommand" size="md" variant="primary">
                  <PhPaperPlaneRightIcon />
                  Send
                </Button>
              </div>
            </div>
            <div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Quick commands:</span>
              <button v-for="qc in quickCommands" :key="qc" class="hover:text-blue-500 transition-colors"
                @click="applyQuickCommand(qc)">{{ qc }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>