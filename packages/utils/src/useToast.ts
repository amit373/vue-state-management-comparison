import { ref, type Ref } from 'vue';
import type { Toast } from '@vue-state-lab/types';
import { generateId } from './index';

/**
 * Composable for managing toast notifications
 * Can be used with any state management pattern
 */
export function useToast() {
  const toasts = ref<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = generateId();
    const toast: Toast = {
      id,
      message,
      type,
    };
    toasts.value.push(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t: Toast) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
}

