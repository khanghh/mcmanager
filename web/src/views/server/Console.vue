<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, type Ref } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { MessageType, Message, CmdConnect, Unsubscribe, CmdInput } from "@/generated/message";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import {
  PhPlayIcon,
  PhStopIcon,
  PhXIcon,
  PhArrowClockwiseIcon,
  PhTrashIcon,
  PhPaperPlaneRightIcon,
  PhUsersThreeIcon,
  PhClockIcon,
  PhTerminalWindowIcon,
  PhFileTextIcon,
  PhFolderIcon,
  PhPlugIcon,
  PhArchiveIcon,
  PhGearIcon,
} from "@/icons";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { useApi, ServerState, ApiError } from "@/composables/useApi";
import { useWebsocket, UseWebsocket } from "@/composables/useWebsocket";
import { useToast } from "@/composables/useToast";
import { useClipboard } from '@/composables/useClipboard';
import CPUCard from "@/components/server/CPUCard.vue";
import MemoryCard from "@/components/server/MemoryCard.vue";
import DiskCard from "@/components/server/DiskCard.vue";
import UptimeCard from "@/components/server/UptimeCard.vue";
const { copyText } = useClipboard()

const route = useRoute();
const api = useApi();
const toast = useToast();

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

const serverName = (route.params.name as string) || route.path.split('/')[2];
const quickCommands = ["help", "list", "stop", "reload"] as const;
const activeTab = ref<'console' | 'code-editor' | 'file-manager' | 'plugins' | 'backups' | 'settings'>('console');

const switchTab = (tab: 'console' | 'code-editor' | 'file-manager' | 'plugins' | 'backups' | 'settings') => {
  activeTab.value = tab;

  // Fix terminal display when switching to console tab
  if (tab === 'console' && fitAddon) {
    // Use nextTick to ensure the DOM has updated before resizing
    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.error('Failed to fit terminal:', e);
      }
    }, 100);
  }
};

let term!: Terminal;
let fitAddon!: FitAddon;
let ws!: UseWebsocket;
let fetchStateTimer!: number;
let uptimeTimer!: number;

// computed
const isStopped = computed(() => serverState.value?.status === "stopped" || serverState.value?.status === "unknown");
const isRunning = computed(() => serverState.value && serverState.value.status === "running");
const cpuCount = computed(() => serverState.value?.cpuLimit);

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

const cpuPercentage = computed(() => {
  if (!serverState.value?.cpuUsage) return 0;
  return Math.round(serverState.value.cpuUsage * 100) / 100;
});


const memoryPercentage = computed(() => {
  if (!serverState.value?.memoryUsage || !serverState.value?.memoryLimit) return 0;
  return Math.min(Math.round((serverState.value.memoryUsage / serverState.value.memoryLimit) * 100), 100);
});

const diskPercentage = computed(() => {
  if (!serverState.value?.diskUsage || !serverState.value?.diskSize) return 0;
  return Math.min(Math.round((serverState.value.diskUsage / serverState.value.diskSize) * 100), 100);
});

// Format helpers


const formatUptime = (seconds: number | undefined) => {
  if (!seconds) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formattedUptime = computed(() => formatUptime(uptime.value));


const initTerminal = () => {
  if (!terminalContainer.value) return;
  const encoder = new TextEncoder();

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
  term.onData((data) => {
    sendInput(encoder.encode(data));
  });
  term.attachCustomKeyEventHandler((arg) => {
    if (arg.ctrlKey && arg.code === "KeyC" && arg.type === "keydown") {
      const selection = term.getSelection();
      if (selection) {
        copyText(selection);
        return false;
      }
    } else if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
      return false;
    }
    return true;
  });
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

const sendInput = (data: Uint8Array<ArrayBuffer>) => {
  if (!ws.isConnected.value) return;
  const msg = Message.create({
    type: MessageType.CMD_INPUT,
    cmdInput: CmdInput.create({ id: serverName, data })
  });
  ws.send(msg);
}

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

const vscodeFrame = ref<HTMLIFrameElement | null>(null);

const onFrameLoad = () => {
  if (!vscodeFrame.value?.contentWindow) return;

  const apiURL = `${window.location.origin}/api/servers/${serverName}/fs`;

  vscodeFrame.value.contentWindow.postMessage({
    type: 'init',
    apiURL: apiURL
  }, '*');
};

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
  <AdminLayout full-width>
    <PageBreadcrumb :path="breadcrumbPath" />

    <!-- Control Bar Card -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Left: Server Info -->
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white first-letter:uppercase">{{ serverName }}
            </h1>
            <Badge :variant="statusBadgeVariant">
              <span :class="['h-2 w-2 rounded-full', statusDotClasses]"></span>
              <span class="first-letter:uppercase">{{ serverStatus }}</span>
            </Badge>
          </div>
          <div class="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <PhUsersThreeIcon class="text-indigo-500" weight="fill" />
              <span>Online: <strong class="text-gray-900 dark:text-white">{{ isRunning ? '0 / 0' : '0 / 0'
                  }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <PhClockIcon class="text-purple-500" weight="fill" />
              <span>Uptime: <strong class="text-gray-900 dark:text-white">{{ formattedUptime }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Right: Action Buttons -->
        <div
          class="flex flex-nowrap items-center gap-3 justify-end overflow-x-auto pb-2 sm:pb-0">
          <Button v-if="isStopped" @click="startServer" size="md" variant="primary" class="whitespace-nowrap">
            <PhPlayIcon weight="fill" />
            Start
          </Button>
          <template v-else>
            <Button v-if="!isStopped"
              @click="stopServer" :disabled="serverStatus === 'stopping'" size="md" variant="danger"
              class="whitespace-nowrap">
              <PhStopIcon weight="fill" />
              Stop
            </Button>
            <Button v-if="!isStopped" @click="restartServer" size="md" variant="primary" soft outline
              class="whitespace-nowrap">
              <PhArrowClockwiseIcon />
              Restart
            </Button>
            <Button v-if="!isStopped"
              @click="killServer" size="md" variant="danger" soft outline class="whitespace-nowrap">
              <PhXIcon />
              Kill
            </Button>
          </template>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <!-- Tabs Navigation - Full Width -->
      <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div class="grid grid-cols-6">
          <button @click="switchTab('console')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'console'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhTerminalWindowIcon class="w-5 h-5" />
            <span>Console</span>
          </button>
          <button @click="switchTab('code-editor')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'code-editor'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhFileTextIcon class="w-5 h-5" />
            <span>Code Editor</span>
          </button>
          <button @click="switchTab('file-manager')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'file-manager'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhFolderIcon class="w-5 h-5" />
            <span>File Manager</span>
          </button>
          <button @click="switchTab('plugins')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'plugins'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhPlugIcon class="w-5 h-5" />
            <span>Plugins</span>
          </button>
          <button @click="switchTab('backups')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'backups'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhArchiveIcon class="w-5 h-5" />
            <span>Backups</span>
          </button>
          <button @click="switchTab('settings')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhGearIcon class="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <!-- Tab Contents -->
      <div>
        <!-- Console Tab Content -->
        <div v-show="activeTab === 'console'" class="flex flex-col gap-4 p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CPUCard :cpuPercentage="cpuPercentage" :cpuCount="cpuCount" />
            <MemoryCard :usage="serverState?.memoryUsage" :limit="serverState?.memoryLimit"
              :percentage="memoryPercentage" />
            <DiskCard :usage="serverState?.diskUsage" :size="serverState?.diskSize" :percentage="diskPercentage" />
            <UptimeCard :uptime="uptime" />
          </div>
          <div
            class="flex flex-col rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800 shadow-sm overflow-hidden">
            <div
              class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <div class="flex items-center gap-2 pl-2">
                <h3 class="font-semibold text-gray-900 dark:text-white">Server Console</h3>
              </div>
              <div class="flex items-center gap-3">
                <Button @click="clearConsole" size="md" variant="secondary" outline>
                  <PhTrashIcon />
                  Clear
                </Button>
              </div>
            </div>

            <!-- Terminal -->
            <div class="h-[50vh]">
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

        <!-- Code Editor Tab Content -->
        <div v-show="activeTab === 'code-editor'" class="h-[calc(100vh-200px)]">
          <iframe ref="vscodeFrame" src="/vscode/" class="h-full w-full border-0 rounded-lg"
            @load="onFrameLoad"></iframe>
        </div>

        <!-- File Manager Tab Content -->
        <div v-show="activeTab === 'file-manager'" class="p-6">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <PhFolderIcon class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">File Manager</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-md">
              File management functionality will be available here soon.
            </p>
          </div>
        </div>

        <!-- Plugins Tab Content -->
        <div v-show="activeTab === 'plugins'" class="p-6">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <PhPlugIcon class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Plugins</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-md">
              Plugin management functionality will be available here soon.
            </p>
          </div>
        </div>

        <!-- Backups Tab Content -->
        <div v-show="activeTab === 'backups'" class="p-6">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <PhArchiveIcon class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Backups</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-md">
              Backup management functionality will be available here soon.
            </p>
          </div>
        </div>

        <!-- Settings Tab Content -->
        <div v-show="activeTab === 'settings'" class="p-6">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
              <PhGearIcon class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Settings</h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-md">
              Server settings will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>