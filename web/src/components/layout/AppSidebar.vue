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
              <PhDotsThreeIcon v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                  'menu-item group w-full',
                  isSubmenuOpen(groupIndex, index) ? 'menu-item-active' : 'menu-item-inactive',
                  !isExpanded ? 'lg:justify-center' : 'lg:justify-start',
                ]">
                  <span :class="[
                    'menu-item-icon',
                    isSubmenuOpen(groupIndex, index) ? 'menu-item-icon-active' : 'menu-item-icon-inactive',
                  ]">
                    <component :is="resolveIcon(item.icon)" class="w-full h-full" />
                  </span>
                  <span v-if="isExpanded || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <PhCaretDownIcon v-if="isExpanded || isMobileOpen" :class="[
                    'ml-auto w-5 h-5 transition-transform duration-200',
                    {
                      'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                    },
                  ]" />
                </button>
                <router-link v-else-if="item.path" :to="item.path" :class="[
                  'menu-item group',
                  isActive(item.path) ? 'menu-item-active' : 'menu-item-inactive',
                ]">
                  <span :class="[
                    'menu-item-icon',
                    isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
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
                          isActive(subItem.path) ? 'menu-item-active' : 'menu-item-inactive']">
                          <span :class="[
                            'menu-item-icon',
                            isActive(subItem.path) ? 'menu-icon-active' : 'menu-icon-inactive',
                          ]">
                            <component :is="resolveIcon(subItem.icon || item.icon)" class="w-full h-full" />
                          </span>
                          <span class="menu-dropdown-text">{{ subItem.name }}</span>
                          <span v-if="subItem.new || subItem.pro" class="flex items-center gap-1 ml-auto">
                            <span v-if="subItem.new" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive',
                            ]">
                              new
                            </span>
                            <span v-if="subItem.pro" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive',
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

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { PhCaretDownIcon, PhDotsThreeIcon } from "@/icons";
import * as Icons from "@/icons";
import { useSidebar } from "@/composables/useSidebar";
import { useConfig } from "@/composables/useConfig";

interface SubItem {
  name: string;
  path: string;
  icon?: string;
  new?: boolean;
  pro?: boolean;
}

interface MenuItem {
  icon: string;
  name: string;
  path?: string;
  subItems?: SubItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const route = useRoute();

const { isExpanded, isMobileOpen, openSubmenu } = useSidebar();
const config = useConfig();

// Resolve icon component from its string name. Fallback to GridIcon.
const resolveIcon = (name: string | undefined) => {
  if (!name) return Icons.PhSquaresFourIcon;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Icons as any)[name] || Icons.PhSquaresFourIcon;
};

const serverMenuItems = computed<MenuItem[]>(() => {
  if (!config.value || !config.value.servers) {
    return [];
  }
  return config.value.servers.map((item) => ({
    icon: item.icon || "PhCubeIcon",
    name: item.name,
    path: `/servers/${item.name.toLowerCase()}`,
    subItems: [
      {
        name: "Console",
        path: `/servers/${item.name.toLowerCase()}?tab=console`,
        icon: "PhTerminalIcon",
      },
      {
        name: "Code Editor",
        path: `/servers/${item.name.toLowerCase()}?tab=code-editor`,
        icon: "PhCodeIcon",
      },
      {
        name: "File Manager",
        path: `/servers/${item.name.toLowerCase()}?tab=file-manager`,
        icon: "PhFolderIcon",
      },
      {
        name: "Plugins",
        path: `/servers/${item.name.toLowerCase()}?tab=plugins`,
        icon: "PhPuzzlePieceIcon",
      },
      {
        name: "Backups",
        path: `/servers/${item.name.toLowerCase()}?tab=backups`,
        icon: "PhArchiveIcon",
      },
      {
        name: "Settings",
        path: `/servers/${item.name.toLowerCase()}?tab=settings`,
        icon: "PhGearIcon",
      }
    ]
  }));
});

const menuGroups = computed<MenuGroup[]>(() => [
  {
    title: "Navigation",
    items: [
      {
        icon: "PhSpeedometerIcon",
        name: "Overview",
        path: "/overview",
      },
    ],
  },
  {
    title: "Servers",
    items: serverMenuItems.value
  },
]);

const isActive = (path: string) => {
  if (path.includes('?')) {
    const [pathPart, queryPart] = path.split('?');
    const queryParams = new URLSearchParams(queryPart);
    if (route.path !== pathPart) return false;
    for (const [key, value] of queryParams.entries()) {
      if (route.query[key] !== value) return false;
    }
    return true;
  }
  return route.path === path;
};

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
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

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
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
const beforeEnter = (el: Element) => {
  const elem = el as HTMLElement;
  elem.style.height = "0px";
  elem.style.overflow = "hidden";
};

const enter = (el: Element) => {
  const elem = el as HTMLElement;
  // Expand to full height
  elem.style.height = elem.scrollHeight + "px";
};

const afterEnter = (el: Element) => {
  const elem = el as HTMLElement;
  // Cleanup inline styles
  elem.style.height = "";
  elem.style.overflow = "";
};

const beforeLeave = (el: Element) => {
  const elem = el as HTMLElement;
  // Set current height to allow transition to zero
  elem.style.height = elem.scrollHeight + "px";
  elem.style.overflow = "hidden";
};

const leave = (el: Element) => {
  const elem = el as HTMLElement;
  // Force reflow then collapse
  void elem.offsetHeight;
  elem.style.height = "0px";
};

const afterLeave = (el: Element) => {
  const elem = el as HTMLElement;
  elem.style.height = "";
  elem.style.overflow = "";
};
</script>
