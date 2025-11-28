<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { MessageType, Message, CmdConnect, Unsubscribe, CmdInput } from "@/generated/message";
import Button from "@/components/ui/Button.vue";
import Badge from "@/components/ui/Badge.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { useApi, ServerState, ApiError } from "@/composables/useApi";
import { useWebsocket, UseWebsocket } from "@/composables/useWebsocket";
import { useToast } from "@/composables/useToast";
import { useClipboard } from '@/composables/useClipboard';
import CPUCard from "@/components/server/CPUCard.vue";
import MemoryCard from "@/components/server/MemoryCard.vue";
import DiskCard from "@/components/server/DiskCard.vue";
import UptimeCard from "@/components/server/UptimeCard.vue";
import {
  PhPlayIcon,
  PhStopIcon,
  PhXIcon,
  PhArrowClockwiseIcon,
  PhTrashIcon,
  PhPaperPlaneRightIcon,
  PhUsersThreeIcon,
  PhClockIcon,
  PhTerminalIcon,
  PhCodeIcon,
  PhFolderIcon,
  PhPlugIcon,
  PhArchiveIcon,
  PhGearIcon,
  PhCopyIcon,
  PhPuzzlePieceIcon,
  PhCheckIcon,
} from "@/icons";

// composable variables
const route = useRoute();
const api = useApi();
const toast = useToast();
const router = useRouter();
const { copyText } = useClipboard();

// constants
const serverName = computed(() => (route.params.name as string) || route.path.split('/')[2]);
const quickCommands = ["help", "list", "stop", "reload"] as const;
const validTabs = ['console', 'code-editor', 'file-manager', 'plugins', 'backups', 'settings'] as const;
type TabType = typeof validTabs[number];

// data variables
const terminalContainer = ref(null);
const serverState: Ref<ServerState | null> = ref(null);
const command: Ref<string> = ref("");
const commandInput: Ref<HTMLInputElement | null> = ref(null);
const connected: Ref<boolean> = ref(false);
const autoScroll: Ref<boolean> = ref(false);
const serverStatus: Ref<string> = ref("unknown");
const uptime: Ref<number> = ref(0);
const activeTab = ref<TabType>('console');
const vscodeFrame = ref<HTMLIFrameElement | null>(null);
const isLoadingState: Ref<boolean> = ref(true);
const isShowCodeEditor: Ref<boolean> = ref(false);
const isCodeEditorLoaded: Ref<boolean> = ref(false);

// variables
let term!: Terminal;
let fitAddon!: FitAddon;
let ws!: UseWebsocket;
let fetchStateTimer!: number;
let uptimeTimer!: number;
let resizeObserver!: ResizeObserver;

// computed
const breadcrumbPath = computed(() => ["servers", serverName.value, "Server Console"]);
const isStopped = computed(() => serverState.value?.status === "stopped" || serverState.value?.status === "unknown");
const isRunning = computed(() => serverState.value && serverState.value.status === "running");
const cpuCount = computed(() => serverState.value?.cpuLimit);
const formattedUptime = computed(() => formatUptime(uptime.value));

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

// functions
const initConsole = () => {
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
    scrollback: 1 * 1024 * 1024,
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminalContainer.value);
  fitAddon.fit();
  term.onData((data) => {
    sendInput(encoder.encode(data));
  });
  resizeObserver = new ResizeObserver(() => fitAddon.fit());
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

const clearConsole = () => {
  term.clear();
  fitAddon.fit();
};

const switchTab = (tab: TabType) => {
  router.push({ query: { ...route.query, tab } });
};

const formatUptime = (seconds: number | undefined) => {
  if (!seconds) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const applyQuickCommand = (cmd: string) => {
  command.value = cmd;
  // Focus input for immediate editing/sending
  try { commandInput.value?.focus(); } catch { /* noop */ }
};

const onFrameLoad = () => {
  if (!vscodeFrame.value?.contentWindow) return;
  const apiURL = `${window.location.origin}/api/servers/${serverName.value}/fs`;
  vscodeFrame.value.contentWindow.postMessage({ type: 'init', apiURL: apiURL }, '*');
};

const handleVSCodeMessage = (event: MessageEvent) => {
  if (event.data?.type === 'ready') {
    isCodeEditorLoaded.value = true;
  }
};

const startServer = async () => {
  try {
    await api.startServer(serverName.value);
    toast.info(`${serverName.value} has been started`);
  } catch (e) {
    toast.error(`${serverName.value} failed to start: ${e}`);
  }
};

const stopServer = async () => {
  try {
    serverStatus.value = "stopping";
    await api.stopServer(serverName.value);
    toast.info(`${serverName.value} has been stopped`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to stop server ${serverName.value}: ${(err as ApiError)?.message || err}`)
  }
};

const restartServer = async () => {
  try {
    await api.restartServer(serverName.value);
    toast.info(`${serverName.value} has been restarted`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to restart server ${serverName.value}: ${(err as ApiError)?.message || err}`)
  }
};

const killServer = async () => {
  try {
    await api.killServer(serverName.value);
    toast.info(`${serverName.value} has been stopped`);
  } catch (err: ApiError | unknown) {
    toast.error(`Failed to kill server ${serverName.value}: ${(err as ApiError)?.message || err}`)
  }
};

const sendCommand = async () => {
  if (!command.value.trim()) return;
  try {
    await api.sendCommand(serverName.value, command.value.trim());
    command.value = '';
  } catch (e) {
    toast.error(`${serverName.value} failed to send command: ${e}`);
  }
};

const sendInput = (data: Uint8Array<ArrayBuffer>) => {
  if (!ws.isConnected.value) return;
  const msg = Message.create({
    type: MessageType.CMD_INPUT,
    cmdInput: CmdInput.create({ id: serverName.value, data })
  });
  ws.send(msg);
}

const connectConsole = (svName: string) => {
  console.log("connect console:", svName)
  ws.send(Message.create({
    type: MessageType.CMD_CONNECT,
    cmdConnect: CmdConnect.create({ id: svName })
  }))
}

const disconnectConsole = (svName: string) => {
  console.log("disconnect console:", svName)
  ws.send(Message.create({
    type: MessageType.UNSUBSCRIBE,
    unsubscribe: Unsubscribe.create({ topic: `server:${svName}` })
  }))
}

const fetchServerState = async () => {
  try {
    serverState.value = await api.getServerState(serverName.value);
    serverStatus.value = serverState.value.status;
    if (serverState.value.uptimeSec !== undefined) {
      uptime.value = serverState.value.uptimeSec;
    }
  } catch {
    serverStatus.value = "unknown"
  } finally {
    isLoadingState.value = false;
  }
}

const initWebsocket = () => {
  ws = useWebsocket();
  ws.onopen(() => {
    connected.value = true;
    connectConsole(serverName.value)
  });

  ws.onclose(() => { connected.value = false; });

  ws.onmessage((msg: Message) => {
    if (msg.type === MessageType.ERROR) {
      toast.error(msg.error?.message || 'WebSocket error');
    } else if (msg.type === MessageType.CMD_OUTPUT) {
      if (msg.cmdOutput && term) {
        const text = new TextDecoder().decode(msg.cmdOutput.data);
        term.write(text);
        if (autoScroll.value) {
          try { term?.scrollToBottom?.(); } catch { }
        }
      }
    } else if (msg.type === MessageType.CMD_STATUS) {
      serverStatus.value = msg.cmdStatus.status;
      fetchServerState();
      if (serverStatus.value === "running" ){
        term.clear();
      }
    }
  });
}

// Vue lifecycle
onMounted(async () => {
  // Load server state first; if not found show 404 and bail out
  isLoadingState.value = true;
  await fetchServerState();

  initConsole();
  // Use ResizeObserver to handle container resize
  if (terminalContainer.value) {
    resizeObserver.observe(terminalContainer.value);
  }

  initWebsocket();

  fetchStateTimer = window.setInterval(fetchServerState, 10000);
  uptimeTimer = window.setInterval(() => {
    if (isRunning.value) {
      uptime.value++;
    }
  }, 1000);

  // Listen for messages from VS Code iframe
  window.addEventListener('message', handleVSCodeMessage);
});

onBeforeUnmount(() => {
  if (fetchStateTimer) clearInterval(fetchStateTimer);
  if (uptimeTimer) clearInterval(uptimeTimer);

  // Remove message event listener VS Code iframe
  window.removeEventListener('message', handleVSCodeMessage);

  disconnectConsole(serverName.value)
  resizeObserver.disconnect();
  term.dispose();
});

watch(() => route.query.tab, (newTab) => {
  const tab = (newTab as string);
  if (tab && validTabs.includes(tab as TabType)) {
    activeTab.value = tab as TabType;
  } else {
    activeTab.value = 'console';
  }
  if (activeTab.value === 'console' && fitAddon) {
    fitAddon.fit();
  }
  if (activeTab.value === 'code-editor' && !isCodeEditorLoaded.value) {
    isShowCodeEditor.value = true;
  }
}, { immediate: true });

// Watch for server name changes
watch(serverName, async (newName, oldName) => {
  if (newName !== oldName) {
    // 1. Disconnect old console
    if (oldName && ws && ws.isConnected.value) {
      disconnectConsole(oldName);
    }

    // 2. Reset state
    isLoadingState.value = true;
    serverState.value = null;
    serverStatus.value = "unknown";
    uptime.value = 0;
    command.value = "";
    isCodeEditorLoaded.value = false;
    if (activeTab.value !== 'code-editor') {
      isShowCodeEditor.value = false
    }

    // 3. Clear terminal
    if (term) {
      term.clear();
    }

    // 4. Fetch new state
    await fetchServerState();

    // 5. Connect new console
    if (ws && ws.isConnected.value) {
      connectConsole(newName);
    }

    // // 6. Update VS Code frame if active
    if (activeTab.value === 'code-editor' && vscodeFrame.value) {
      // Force iframe reload by resetting src
      const currentSrc = vscodeFrame.value.src;
      vscodeFrame.value.src = '';
      setTimeout(() => {
        if (vscodeFrame.value) {
          vscodeFrame.value.src = currentSrc;
        }
      }, 0);
    }
  }
});

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
            <div class="flex items-center gap-2" v-if="serverState?.ipAddress">
              <PhPlugIcon class="w-4 h-4 text-blue-500" weight="fill" />
              <span>IP: <strong class="text-gray-900 dark:text-white">{{ serverState.ipAddress }}</strong></span>
              <div class="relative inline-block group">
                <button @click="copyText(serverState.ipAddress)"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <PhCopyIcon class="w-4 h-4" weight="bold" />
                </button>
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  Copy
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45">
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <PhUsersThreeIcon class="w-4 h-4 text-indigo-500" weight="fill" />
              <span>Online:
                <strong class="text-gray-900 dark:text-white">
                  {{ isRunning ? '0 / 0' : '0 / 0' }}
                </strong>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <PhClockIcon class="w-4 h-4 text-purple-500" weight="fill" />
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
            <PhTerminalIcon class="w-5 h-5" weight="bold" />
            <span>Console</span>
          </button>
          <button @click="switchTab('code-editor')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'code-editor'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhCodeIcon class="w-5 h-5" weight="bold" />
            <span>Code Editor</span>
          </button>
          <button @click="switchTab('file-manager')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'file-manager'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhFolderIcon class="w-5 h-5" weight="bold" />
            <span>File Manager</span>
          </button>
          <button @click="switchTab('plugins')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'plugins'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhPuzzlePieceIcon class="w-5 h-5" weight="bold" />
            <span>Plugins</span>
          </button>
          <button @click="switchTab('backups')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'backups'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhArchiveIcon class="w-5 h-5" weight="bold" />
            <span>Backups</span>
          </button>
          <button @click="switchTab('settings')" :class="[
            'py-6 px-6 font-medium text-base flex items-center justify-center gap-2 transition-colors',
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-900/50'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            <PhGearIcon class="w-5 h-5" weight="bold" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <!-- Tab Contents -->
      <div>
        <!-- Console Tab Content -->
        <div v-show="activeTab === 'console'" class="flex flex-col gap-4 p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CPUCard :cpuPercentage="cpuPercentage" :cpuCount="cpuCount" :loading="isLoadingState" />
            <MemoryCard :usage="serverState?.memoryUsage" :limit="serverState?.memoryLimit"
              :percentage="memoryPercentage"
              :loading="isLoadingState" />
            <DiskCard :usage="serverState?.diskUsage" :size="serverState?.diskSize" :percentage="diskPercentage"
              :loading="isLoadingState" />
            <UptimeCard :uptime="uptime" :loading="isLoadingState" />
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
                  @click="applyQuickCommand(qc)">{{ qc }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Code Editor Tab Content -->
        <div v-show="activeTab === 'code-editor'" class="h-[calc(100vh-200px)] relative">
          <!-- Loading Indicator -->
          <div v-if="!isCodeEditorLoaded"
            class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin">
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Loading Code Editor...</p>
            </div>
          </div>
          <iframe v-if="isShowCodeEditor" ref="vscodeFrame" @load="onFrameLoad" src="/vscode/"
            class="h-full w-full border-0 rounded-lg">
          </iframe>
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
