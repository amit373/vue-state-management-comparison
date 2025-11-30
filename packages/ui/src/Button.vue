<template>
  <button
    :class="[
      'font-medium rounded-lg transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'active:scale-95 disabled:active:scale-100',
      variantClasses,
      sizeClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClasses = {
  primary:
    'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm hover:shadow focus:ring-gray-500',
  secondary:
    'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm hover:shadow focus:ring-gray-500',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow focus:ring-red-500',
  ghost:
    'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};
</script>
