<template>
  <div
    class="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
  >
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
        {{ post.title }}
      </h3>
    </div>

    <!-- Body -->
    <div class="px-6 py-5">
      <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed text-sm">
        {{ post.body }}
      </p>
      <div class="flex items-center gap-3 text-xs">
        <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          User {{ post.userId }}
        </span>
        <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          #{{ post.id }}
        </span>
      </div>
    </div>

    <!-- Footer with buttons -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
      <div class="flex gap-2">
        <button
          class="flex-1 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center justify-center gap-2"
          @click="$emit('edit', post)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button
          class="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors duration-150 flex items-center justify-center gap-2"
          @click="$emit('delete', post.id)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@vue-state-lab/types';

interface Props {
  post: Post;
}

defineProps<Props>();

defineEmits<{
  edit: [post: Post];
  delete: [id: number];
}>();
</script>
