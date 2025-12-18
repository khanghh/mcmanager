<template>
  <ThemeProvider>
    <ConfirmDialog />
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
    <Toast />
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import Toast from './components/ui/Toast.vue'
import ConfirmDialog from './components/ui/ConfirmDialog.vue'
</script>
