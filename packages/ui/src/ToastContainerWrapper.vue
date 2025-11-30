<template>
  <ToastContainerComponent :toasts="toasts" @remove="removeToast" />
</template>

<script setup lang="ts">
import ToastContainerComponent from './ToastContainer.vue';
import type { Toast } from '@vue-state-lab/types';

interface Props {
  toasts: Toast[];
}

defineProps<Props>();

const emit = defineEmits<{
  remove: [id: string];
}>();

const removeToast = (id: string) => {
  emit('remove', id);
};
</script>

