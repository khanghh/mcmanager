<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
    <Toast />
  </ThemeProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import Toast from './components/ui/Toast.vue'
import { useToast } from '@/composables/useToast'

const { success } = useToast()

onMounted(() => {
  success('Welcome to MCManager!')
})
</script>
