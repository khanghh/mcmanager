<template>
  <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
    :class="{ 'animate-pulse': loading }">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
      <div
        class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
        <PhClockIcon class="w-5 h-5" />
      </div>
    </div>
    <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      <span v-if="loading" class="inline-block w-28 h-8 bg-gray-300 dark:bg-slate-600 rounded"></span>
      <template v-else>{{ formatUptime(uptime) }}</template>
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400">Since last restart</p>
  </div>
</template>

<script setup lang="ts">
import { PhClockIcon } from "@/icons";

defineProps({
  uptime: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const formatUptime = (seconds: number | undefined) => {
  if (!seconds) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
</script>
