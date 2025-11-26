<template>
  <div
    class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
    :class="{ 'animate-pulse': loading }">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</h3>
      <div
        class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <PhCpuIcon class="w-5 h-5" />
      </div>
    </div>
    <span class="flex items-end justify-between">
      <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        <span v-if="loading" class="inline-block w-20 h-8 bg-gray-300 dark:bg-slate-600 rounded"></span>
        <template v-else>{{ cpuPercentage }}%</template>
      </p>
      <p class="text-md text-gray-500 dark:text-gray-400 mb-2 text-right">
        <template v-if="loading">
          <span class="inline-block w-16 h-5 bg-gray-300 dark:bg-slate-600 rounded"></span>
        </template>
        <template v-else-if="cpuCount !== undefined">Cores: {{ cpuCount }}</template>
        <template v-else>Cores: ?</template>
      </p>
    </span>
    <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
      <div v-if="!loading" class="bg-blue-500 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${Math.min(cpuPercentage, 100)}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhCpuIcon } from '@/icons';

defineProps({
  cpuPercentage: {
    type: Number,
    required: true,
  },
  cpuCount: {
    type: Number,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>