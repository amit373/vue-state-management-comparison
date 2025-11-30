<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            Vue State Lab - Provide/Inject
          </h1>
          <ThemeToggle />
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { ThemeToggle } from '@vue-state-lab/ui';
import { providePostsStore } from './composables/usePostsStore';

// Provide store at root level
const store = providePostsStore();

onMounted(() => {
  store.fetchPosts();
  store.fetchUsers();
});
</script>
