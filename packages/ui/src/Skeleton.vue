<template>
  <div
    class="animate-pulse rounded"
    :class="[widthClass, heightClass, baseClasses]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'md',
});

const widthClass = computed(() => {
  if (typeof props.width === 'number') {
    return `w-${props.width}`;
  }
  if (props.width === '100%') {
    return 'w-full';
  }
  return props.width;
});

const heightClass = computed(() => {
  if (typeof props.height === 'number') {
    return `h-${props.height}`;
  }
  return `h-[${props.height}]`;
});

const baseClasses = computed(() => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  return `bg-gray-200 dark:bg-gray-700 ${roundedClasses[props.rounded]}`;
});
</script>

