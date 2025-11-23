<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="With Soft Background">
        <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
          <Badge v-for="variant in variants" :key="variant" :variant="variant">
            {{ variant }}
          </Badge>
        </div>
      </ComponentCard>
      <ComponentCard title="With Solid Background">
        <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
          <Badge v-for="variant in variants" :key="variant" :variant="variant" solid>
            {{ variant }}
          </Badge>
        </div>
      </ComponentCard>
      <ComponentCard title="With Outline Background">
        <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
          <Badge v-for="variant in variants" :key="variant" :variant="variant" outline>
            {{ variant }}
          </Badge>
        </div>
      </ComponentCard>
      <ComponentCard title="Rounded Badges">
        <div class="flex flex-wrap gap-4 sm:items-center sm:justify-center">
          <Badge v-for="variant in variants" :key="variant" :variant="variant" rounded>
            {{ variant }}
          </Badge>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const currentPageTitle = ref('Badge')

const variants = ['primary', 'secondary', 'success', 'warning', 'danger'] as const
</script>
