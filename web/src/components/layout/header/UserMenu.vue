<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown">
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img :src="gravatarUrl" alt="User" />
      </span>
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <span class="block px-3 py-2 font-medium text-gray-700 text-theme-md dark:text-gray-400">
        {{ userEmail }}
      </span>

      <ul v-if="menuItems.length > 0" class="flex flex-col gap-1 border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <div class="pt-2 border-b dark:border-gray-600"></div>
      <a href="/cdn-cgi/access/logout"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <PhSignOutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        Sign out
      </a>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { PhSignOutIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, type Component, onMounted, onUnmounted, computed, watch } from 'vue'
import { useConfig } from '@/composables/useConfig'
import md5 from 'blueimp-md5'

type MenuItem = {
  href: string
  icon: Component
  text: string
}

const config = useConfig()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const menuItems = ref<MenuItem[]>([])
const userEmail = ref<string>()

const gravatarUrl = computed<string>(() => {
  let hashStr = ''
  if (userEmail.value) {
    const email = userEmail.value.toLowerCase().trim()
    hashStr = md5(email)
  }
  return `https://www.gravatar.com/avatar/${hashStr}?d=identicon&s=44`
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && event.target instanceof Node && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (config.value?.userEmail) {
    userEmail.value = config.value.userEmail
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>
