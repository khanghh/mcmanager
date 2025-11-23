<template>
  <AdminLayout>
    <div class="h-[calc(100vh-200px)] flex flex-col">
      <PageBreadcrumb :path="[currentPageTitle]" />
      <div
        class="flex-1 overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <iframe
          ref="vscodeFrame"
          src="/vscode/"
          class="h-full w-full border-0"
          @load="onFrameLoad"></iframe>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";

const route = useRoute();
const serverName = (route.params.name as string) || route.path.split('/')[2];
const currentPageTitle = computed(() => `Code Editor`);

const vscodeFrame = ref<HTMLIFrameElement | null>(null);

const onFrameLoad = () => {
  if (!vscodeFrame.value?.contentWindow) return;

  const apiURL = `${window.location.origin}/api/servers/${serverName}/fs`;

  vscodeFrame.value.contentWindow.postMessage({
    type: 'init',
    apiURL: apiURL
  }, '*');
};
</script>

<style></style>
