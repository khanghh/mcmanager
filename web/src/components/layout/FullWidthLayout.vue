<template>
  <div class="h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']">
      <app-header />
      <div class="flex-1 overflow-hidden">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()

</script>
