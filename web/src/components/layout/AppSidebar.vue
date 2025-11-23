<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen,
        'lg:w-[90px]': !isExpanded,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]">
    <div
      :class="[
        'py-8 flex',
        !isExpanded ? 'lg:justify-center' : 'justify-start',
      ]">
      <router-link to="/">
        <img
          v-if="isExpanded || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="200"
          height="40" />
        <img
          v-if="isExpanded || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="200"
          height="40" />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="40"
          height="40" />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]">
              <template v-if="isExpanded || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                  'menu-item group w-full',
                  {
                    'menu-item-active': isSubmenuOpen(groupIndex, index),
                    'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                  },
                  !isExpanded
                    ? 'lg:justify-center'
                    : 'lg:justify-start',
                ]">
                  <span :class="[
                    'menu-item-icon',
                    isSubmenuOpen(groupIndex, index)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="resolveIcon(item.icon)" class="w-full h-full" />
                  </span>
                  <span v-if="isExpanded || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <ChevronDownIcon v-if="isExpanded || isMobileOpen" :class="[
                    'ml-auto w-5 h-5 transition-transform duration-200',
                    {
                      'rotate-180 text-brand-500': isSubmenuOpen(
                        groupIndex,
                        index
                      ),
                    },
                  ]" />
                </button>
                <router-link v-else-if="item.path" :to="item.path" :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive(item.path),
                    'menu-item-inactive': !isActive(item.path),
                  },
                ]">
                  <span :class="[
                    'menu-item-icon',
                    isActive(item.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="resolveIcon(item.icon)" class="w-full h-full" />
                  </span>
                  <span v-if="isExpanded || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                </router-link>
                <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
                  @before-leave="beforeLeave"
                  @leave="leave" @after-leave="afterLeave">
                  <div v-show="isSubmenuOpen(groupIndex, index) && (isExpanded || isMobileOpen)"
                    class="overflow-hidden transition-all duration-300 ease-in-out">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link :to="subItem.path" :class="[
                          'menu-item',
                          isActive(subItem.path)
                            ? 'menu-item-active'
                            : 'menu-item-inactive',
                        ]">
                          <span :class="[
                            'menu-item-icon',
                            isActive(subItem.path)
                              ? 'menu-icon-active'
                              : 'menu-icon-inactive',
                          ]">
                            <component :is="resolveIcon(subItem.icon || item.icon)" class="w-full h-full" />
                          </span>
                          <span class="menu-dropdown-text">{{ subItem.name }}</span>
                          <span v-if="subItem.new || subItem.pro" class="flex items-center gap-1 ml-auto">
                            <span v-if="subItem.new" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive',
                            ]">
                              new
                            </span>
                            <span v-if="subItem.pro" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive',
                            ]">
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import { ChevronDownIcon, HorizontalDots } from "@/icons";
import * as Icons from "@/icons";
import SidebarWidget from "./SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";
import { useConfig } from "@/composables/useConfig";

const route = useRoute();

const { isExpanded, isMobileOpen, openSubmenu } = useSidebar();
const config = useConfig();

// Resolve icon component from its string name. Fallback to GridIcon.
const resolveIcon = (name) => {
  if (!name) return Icons.GridIcon;
  return Icons[name] || Icons.GridIcon;
};

const serverMenuItems = computed(() => {
  if (!config.value || !config.value.servers) {
    return [];
  }
  return config.value.servers.map((item) => ({
    icon: item.icon || "BoxCubeIcon",
    name: item.name,
    path: `/servers/${item.name.toLowerCase()}`,
    subItems: [
      { name: "Overview", path: `/servers/${item.name.toLowerCase()}/overview`, pro: false, icon: "PhSpeedometerIcon" },
      { name: "Server Editor", path: `/servers/${item.name.toLowerCase()}/editor`, pro: false, icon: "BoxIcon" },
      { name: "Server Console", path: `/servers/${item.name.toLowerCase()}/console`, pro: false, icon: "PhTerminalWindowIcon" },
      // { name: "Players", path: `/servers/${item.name.toLowerCase()}/players`, pro: item.proPlayers || false, icon: "GridIcon", new: item.newPlayers || false },
    ],
  }));
});

const menuGroups = computed(() => [
  {
    title: "Navigation",
    items: [
      {
        icon: "PhSpeedometerIcon",
        name: "Overview",
        path: "/dashboard",
      },
    ],
  },
  {
    title: "Servers",
    items: serverMenuItems.value
  },
]);

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups.value[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

// Smooth expand/collapse for submenu
const beforeEnter = (el) => {
  el.style.height = "0px";
  el.style.overflow = "hidden";
};

const enter = (el) => {
  // Expand to full height
  el.style.height = el.scrollHeight + "px";
};

const afterEnter = (el) => {
  // Cleanup inline styles
  el.style.height = "";
  el.style.overflow = "";
};

const beforeLeave = (el) => {
  // Set current height to allow transition to zero
  el.style.height = el.scrollHeight + "px";
  el.style.overflow = "hidden";
};

const leave = (el) => {
  // Force reflow then collapse
  void el.offsetHeight;
  el.style.height = "0px";
};

const afterLeave = (el) => {
  el.style.height = "";
  el.style.overflow = "";
};
</script>
