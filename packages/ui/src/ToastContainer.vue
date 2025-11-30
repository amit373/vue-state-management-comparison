<template>
  <div
    class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full"
    role="region"
    aria-live="polite"
    aria-label="Notifications"
  >
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-lg shadow-lg flex items-start justify-between gap-4',
          'animate-in slide-in-from-top-5',
          toastTypeClasses[toast.type],
        ]"
      >
        <div class="flex-1">
          <p class="font-medium">{{ toast.message }}</p>
        </div>
        <button
          class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          @click="removeToast(toast.id)"
          aria-label="Close notification"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Toast } from '@vue-state-lab/types';

interface Props {
  toasts: Toast[];
}

defineProps<Props>();

const emit = defineEmits<{
  remove: [id: string];
}>();

const toastTypeClasses = {
  success:
    'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  error:
    'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  info: 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  warning:
    'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
};

const removeToast = (id: string) => {
  emit('remove', id);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>

