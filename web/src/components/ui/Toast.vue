<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4 sm:px-0">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
        move-class="transition duration-200 ease-in-out">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-900 dark:ring-white dark:ring-opacity-10"
          @click="removeToast(toast.id)"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <SuccessIcon v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" />
                <ErrorIcon v-else-if="toast.type === 'error'" class="h-6 w-6 text-red-400" />
                <WarningIcon v-else-if="toast.type === 'warning'" class="h-6 w-6 text-yellow-400" />
                <InfoIcon v-else class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p v-if="toast.title" class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ toast.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400" :class="{ 'mt-1': toast.title }">{{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-zinc-900 dark:text-gray-500 dark:hover:text-gray-400"
                  @click.stop="removeToast(toast.id)">
                  <span class="sr-only">Close</span>
                  <PhX class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon } from '@/icons'
import { PhX } from '@phosphor-icons/vue'

const { toasts, removeToast, pauseToast, resumeToast } = useToast()
</script>
