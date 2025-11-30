<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-pulse"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <Skeleton :width="40" :height="40" rounded="full" />
        <div class="flex-1">
          <Skeleton :width="120" :height="16" class="mb-2" />
          <Skeleton :width="80" :height="12" />
        </div>
      </div>
      <Skeleton :width="60" :height="20" rounded="full" />
    </div>

    <!-- Title -->
    <Skeleton :width="'90%'" :height="20" class="mb-3" />

    <!-- Body lines -->
    <div class="space-y-2 mb-4">
      <Skeleton :width="'100%'" :height="14" />
      <Skeleton :width="'100%'" :height="14" />
      <Skeleton :width="'75%'" :height="14" />
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <Skeleton :width="100" :height="12" />
      <div class="flex gap-2">
        <Skeleton :width="60" :height="36" rounded="lg" />
        <Skeleton :width="60" :height="36" rounded="lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue';
</script>

