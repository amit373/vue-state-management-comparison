<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing <span class="font-medium text-gray-900 dark:text-gray-100">{{ start }}</span> to 
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ end }}</span> of 
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ total }}</span> results
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Per page:</span>
        <select
          :value="limit"
          @change="handleLimitChange"
          class="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300 focus:border-gray-900 dark:focus:border-gray-300 transition-colors duration-150 cursor-pointer appearance-none bg-no-repeat bg-right pr-8"
          style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.5rem center; background-size: 1.25em 1.25em;"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
            class="bg-white dark:bg-gray-700"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
        :disabled="currentPage === 1"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === 1
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        ]"
        @click="$emit('prev')"
      >
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </span>
      </button>
      
      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            'min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            page === currentPage
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          ]"
          @click="$emit('change', page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        :disabled="currentPage === totalPages"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentPage === totalPages
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        ]"
        @click="$emit('next')"
      >
        <span class="flex items-center gap-1.5">
          Next
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  perPageOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [12, 24, 48, 100],
});

const emit = defineEmits<{
  prev: [];
  next: [];
  change: [page: number];
  changeLimit: [limit: number];
}>();

const start = computed(() => (props.currentPage - 1) * props.limit + 1);
const end = computed(() =>
  Math.min(props.currentPage * props.limit, props.total)
);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let startPage = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(props.totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

const handleLimitChange = (event: Event) => {
  const newLimit = parseInt((event.target as HTMLSelectElement).value, 10);
  emit('changeLimit', newLimit);
};
</script>
