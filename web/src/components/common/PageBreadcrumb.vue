<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
      {{ lastSegment }}
    </h2>
    <nav>
      <ol class="flex items-center gap-1.5 text-sm">
        <li>
          <router-link
            class="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
            to="/"
          >
            <PhHouseIcon class="w-4 h-4" weight="fill" />
            <span>Home</span>
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke=""
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </li>
        <template v-for="(segment, idx) in path" :key="idx">
          <li v-if="idx < path.length - 1" class="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span class="first-letter:uppercase">{{ segment }}</span>
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke=""
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>
        </template>
        <li class="text-gray-800 dark:text-white/90 first-letter:uppercase">
          {{ lastSegment }}
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { PhHouseIcon } from '@/icons'

interface BreadcrumbProps {
  path: string[]
}

const props = defineProps<BreadcrumbProps>()
const lastSegment = computed(() => props.path[props.path.length - 1] || '')
</script>
