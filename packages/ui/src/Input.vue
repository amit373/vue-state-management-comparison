<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'w-full px-4 py-3 rounded-xl border-2 transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
      'border-gray-200 dark:border-gray-600',
      'text-gray-900 dark:text-gray-100',
      'placeholder-gray-400 dark:placeholder-gray-500',
      'focus:ring-gray-900 focus:border-gray-900 dark:focus:ring-gray-300 dark:focus:border-gray-300',
      'hover:border-gray-300 dark:hover:border-gray-500',
      'shadow-sm hover:shadow-md focus:shadow-lg',
    ]"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

