<template>
  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div id="chartThree" class="-ml-4 min-w-[1000px] xl:min-w-full pl-2">
      <VueApexCharts type="area" height="310" :options="options" :series="series" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

defineProps({
  series: {
    type: Array,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
