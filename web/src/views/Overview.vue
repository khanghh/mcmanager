<template>
  <AdminLayout>
    <PageBreadcrumb :path="['Overview']" />

    <div class="space-y-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10">
              <PhHardDrivesIcon class="h-6 w-6" weight="fill" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Servers</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">12</h4>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10">
              <PhCheckCircleIcon class="h-6 w-6" weight="fill" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Servers</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">8</h4>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10">
              <PhUsersThreeIcon class="h-6 w-6" weight="fill" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Players</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">1,245</h4>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <PhCpuIcon class="h-6 w-6" weight="fill" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">System Load</p>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">42%</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Chart Section -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Resource Usage History</h3>
            <select
              class="rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-gray-400">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div class="h-[300px] w-full">
            <LineChart :series="chartSeries" :options="chartOptions" />
          </div>
        </div>

        <!-- Server List -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Servers</h3>
            <router-link to="/servers" class="text-sm font-medium text-blue-500 hover:text-blue-600">View
              All</router-link>
          </div>
          <div class="flex flex-col gap-4">
            <div v-for="server in topServers" :key="server.name"
              class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400">
                  <PhCubeIcon class="h-5 w-5" weight="fill" />
                </div>
                <div>
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ server.name }}</h5>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ server.players }} players</p>
                </div>
              </div>
              <Badge :variant="server.status === 'running' ? 'success' : 'danger'">
                {{ server.status }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import Badge from "@/components/ui/Badge.vue";
import LineChart from "@/components/charts/LineChart/LineChartOne.vue";
import {
  PhHardDrivesIcon,
  PhCheckCircleIcon,
  PhUsersThreeIcon,
  PhCpuIcon,
  PhCubeIcon,
} from "@/icons";

const topServers = [
  { name: "Survival SMP", players: 128, status: "running" },
  { name: "Creative Plot", players: 45, status: "running" },
  { name: "SkyBlock", players: 89, status: "running" },
  { name: "Lobby-01", players: 230, status: "running" },
  { name: "Test Server", players: 0, status: "stopped" },
];

const chartSeries = ref([
  {
    name: "CPU Usage",
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
  },
  {
    name: "Memory Usage",
    data: [20, 35, 40, 60, 55, 70, 65, 80, 95]
  }
]);

const chartOptions = ref({
  chart: {
    type: "area",
    fontFamily: "inherit",
    height: 300,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  colors: ["#3C50E0", "#80CAEE"],
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    categories: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "23:59"],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    tickAmount: 5,
  },
  grid: {
    strokeDashArray: 5,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: "dark",
  },
});
</script>
