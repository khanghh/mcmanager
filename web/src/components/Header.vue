<script setup>
import { computed, inject } from 'vue'

const { status } = inject('serverStatus')

const statusText = computed(() => {
  switch (status.value.state) {
    case 'running': return 'Online'
    case 'stopping': return 'Stopping'
    case 'stopped': return 'Offline'
    default: return 'Unknown'
  }
})

const onlinePlayers = computed(() => status.value.onlinePlayers || 0)
const maxPlayers = computed(() => status.value.maxPlayers || 0)
</script>

<template>
  <header class="bg-dark px-6 py-4 flex justify-between items-center shadow-custom z-10 relative">
    <div class="logo flex items-center gap-3 font-bold text-xl text-text">
      <BoxIcon class="text-primary text-2xl" />
      <span>Minecraft Server Editor</span>
    </div>
    <div class="server-status flex items-center gap-4 bg-light px-4 py-2 rounded-lg text-sm">
      <div class="status-indicator w-2.5 h-2.5 rounded-full" :class="{
        'bg-green-500 shadow-[0_0_8px_#2ecc71]': status.state === 'running',
        'bg-orange-500 shadow-[0_0_8px_#f39c12]': status.state === 'stopping',
        'bg-red-500 shadow-[0_0_8px_#e74c3c]': status.state === 'stopped',
        'bg-gray-500 shadow-[0_0_8px_#7f8c8d]': status.state === 'unknown'
      }"></div>
      <span>Server Status: {{ statusText }}</span>
      <div class="player-count flex items-center gap-1.5">
        <UsersIcon class="w-4 h-4 lucide-solid" />
        <span>{{ onlinePlayers }}/{{ maxPlayers }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
