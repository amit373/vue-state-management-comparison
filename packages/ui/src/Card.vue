<template>
  <div
    :class="[
      'rounded-lg border shadow-sm transition-shadow duration-200',
      'bg-white dark:bg-gray-800',
      'border-gray-200 dark:border-gray-700',
      'hover:shadow-md',
    ]"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <slot name="header" />
    </div>
    <div :class="['px-6 py-4', $slots.header ? '' : 'pt-6']">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Card component with header, body, and footer slots
</script>

