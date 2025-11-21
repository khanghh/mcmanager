<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium gap-2 rounded-lg transition',
      sizeClasses[size],
      outline ? outlineClasses[variant] : variantClasses[variant],
      className,
      { 'cursor-not-allowed opacity-50': disabled },
    ]"
    @click="onClick"
    :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  soft?: boolean
  outline?: boolean
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  variant: 'primary',
  soft: false,
  outline: false,
  className: '',
  disabled: false,
})

const sizeClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const outlineClasses = {
  primary: props.soft ? 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-300 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30' : 'bg-white text-blue-600 ring-1 ring-inset ring-blue-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:ring-blue-300 dark:hover:bg-white/[0.03] dark:hover:text-blue-300',
  secondary: props.soft ? 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600' : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
  success: props.soft ? 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30' : 'bg-white text-green-600 ring-1 ring-inset ring-green-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-green-400 dark:ring-green-300 dark:hover:bg-white/[0.03] dark:hover:text-green-300',
  warning: props.soft ? 'bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-300 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30' : 'bg-white text-yellow-600 ring-1 ring-inset ring-yellow-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-yellow-400 dark:ring-yellow-300 dark:hover:bg-white/[0.03] dark:hover:text-yellow-300',
  danger: props.soft ? 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-300 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30' : 'bg-white text-red-600 ring-1 ring-inset ring-red-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-red-400 dark:ring-red-300 dark:hover:bg-white/[0.03] dark:hover:text-red-300',
  info: props.soft ? 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-300 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30' : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-indigo-400 dark:ring-indigo-300 dark:hover:bg-white/[0.03] dark:hover:text-indigo-300'
}

const variantClasses = {
  primary: props.soft
    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
    : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
  secondary: props.soft
    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
    : 'bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700',
  success: props.soft
    ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
    : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
  warning: props.soft
    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30'
    : 'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
  danger: props.soft
    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
    : 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
}

const onClick = () => {
  if (!props.disabled && props.onClick) {
    props.onClick()
  }
}
</script>
