<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="[
      'w-full px-4 py-3 rounded-lg border-2 transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'bg-white dark:bg-gray-700',
      'border-gray-300 dark:border-gray-600',
      'text-gray-900 dark:text-gray-100',
      'focus:ring-gray-900 focus:border-gray-900 dark:focus:ring-gray-300 dark:focus:border-gray-300',
      'hover:border-gray-400 dark:hover:border-gray-500',
      'shadow-sm hover:shadow focus:shadow',
      'cursor-pointer appearance-none bg-no-repeat bg-right',
    ]"
    style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.5em 1.5em; padding-right: 2.5rem;"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="bg-white dark:bg-gray-800"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

