<template>
  <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
    :class="{ 'animate-pulse': loading }">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Memory</h3>
      <div
        class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
        <PhMemoryIcon class="w-5 h-5" />
      </div>
    </div>
    <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      <span v-if="loading" class="inline-block w-48 h-8 bg-gray-300 dark:bg-slate-600 rounded"></span>
      <template v-else>
        {{ formatBytes(usage) }} / {{ limit === 0 ? 'Unlimited' : formatBytes(limit) }}
      </template>
    </p>
    <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
      <div v-if="!loading" class="bg-purple-500 h-2 rounded-full transition-all duration-300" :style="{ width: `${percentage}%` }">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhMemoryIcon } from "@/icons";

defineProps({
  usage: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const formatBytes = (bytes: number | undefined) => {
  if (bytes === undefined) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>
