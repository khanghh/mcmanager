<template>
  <span :class="[baseStyles, colorStyles, roundedClass]">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue"

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger"

interface BadgeProps {
  variant?: BadgeVariant
  solid?: boolean
  soft?: boolean
  outline?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: "primary",
  solid: false,
  soft: false,
  outline: false,
  rounded: false,
})

const baseStyles = "inline-flex items-center justify-center gap-1 font-medium leading-none px-2 py-1"

const variantStyles = {
  solid: {
    primary: "bg-blue-500 text-white dark:bg-blue-600",
    secondary: "bg-gray-500 text-white dark:bg-gray-600",
    success: "bg-green-500 text-white dark:bg-green-600",
    warning: "bg-yellow-500 text-white dark:bg-yellow-600",
    danger: "bg-red-500 text-white dark:bg-red-600",
  },
  outline: {
    primary: "border border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400",
    secondary: "border border-gray-500 text-gray-500 dark:text-gray-400 dark:border-gray-400",
    success: "border border-green-500 text-green-500 dark:text-green-400 dark:border-green-400",
    warning: "border border-yellow-500 text-yellow-500 dark:text-yellow-400 dark:border-yellow-400",
    danger: "border border-red-500 text-red-500 dark:text-red-400 dark:border-red-400",
  },
  soft: {
    primary: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
    danger: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  }
}

const colorStyles = computed(() => {
  if (props.solid) return variantStyles.solid[props.variant]
  if (props.outline) return variantStyles.outline[props.variant]
  // default to soft
  return variantStyles.soft[props.variant]
})

const roundedClass = computed(() => props.rounded ? "rounded-full" : "rounded-md")
</script>
