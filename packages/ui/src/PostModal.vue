<template>
  <Transition name="modal">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        @click="$emit('close')"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200"
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {{ post ? 'Edit Post' : 'Create Post' }}
              </h2>
            </div>
            <button
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
              @click="$emit('close')"
              aria-label="Close modal"
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
        </div>

        <!-- Form Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)] bg-white dark:bg-gray-800">
          <form ref="formRef" @submit.prevent="handleSubmit" class="p-6">
            <div class="space-y-5">
              <!-- Title Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <Input
                  v-model="formData.title"
                  placeholder="Enter a compelling post title..."
                  required
                  :class="[
                    'transition-all duration-150',
                    errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-gray-900 focus:border-gray-900 dark:focus:ring-gray-300 dark:focus:border-gray-300'
                  ]"
                  @blur="validateTitle"
                  @input="errors.title && validateTitle()"
                />
                <Transition name="slide-fade">
                  <p v-if="errors.title" class="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ errors.title }}
                  </p>
                </Transition>
              </div>

              <!-- Body Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body
                  <span class="text-red-500 ml-1">*</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-normal ml-auto float-right">
                    {{ formData.body.length }}/1000
                  </span>
                </label>
                <textarea
                  v-model="formData.body"
                  rows="6"
                  :class="[
                    'w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-150 resize-none',
                    errors.body ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-gray-900 focus:border-gray-900 dark:focus:ring-gray-300 dark:focus:border-gray-300'
                  ]"
                  placeholder="Write your post content here..."
                  required
                  @blur="validateBody"
                  @input="errors.body && validateBody()"
                ></textarea>
                <Transition name="slide-fade">
                  <p v-if="errors.body" class="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ errors.body }}
                  </p>
                </Transition>
              </div>

              <!-- User Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div :class="errors.userId ? 'ring-2 ring-red-500 rounded-lg' : ''">
                  <Select
                    v-model="formData.userId"
                    :options="userOptions"
                    placeholder="Select an author..."
                    required
                    @update:model-value="validateUserId"
                  />
                </div>
                <Transition name="slide-fade">
                  <p v-if="errors.userId" class="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ errors.userId }}
                  </p>
                </Transition>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex justify-end gap-3">
            <button
              class="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="isSubmitting"
              class="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="submitForm"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isSubmitting ? 'Saving...' : (post ? 'Update Post' : 'Create Post') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Post, User } from '@vue-state-lab/types';
import { usersApi } from '@vue-state-lab/api';
import Input from './Input.vue';
import Select from './Select.vue';

interface Props {
  post?: Post | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  save: [data: { title: string; body: string; userId: number }];
}>();

const users = ref<User[]>([]);
const formRef = ref<HTMLFormElement | null>(null);
const formData = ref({
  title: '',
  body: '',
  userId: '',
});

const errors = ref({
  title: '',
  body: '',
  userId: '',
});

const isSubmitting = ref(false);

const userOptions = computed(() =>
  users.value.map((user) => ({
    value: user.id.toString(),
    label: user.name,
  }))
);

// Validation functions
const validateTitle = (): boolean => {
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    return false;
  }
  if (formData.value.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters';
    return false;
  }
  if (formData.value.title.trim().length > 100) {
    errors.value.title = 'Title must be less than 100 characters';
    return false;
  }
  errors.value.title = '';
  return true;
};

const validateBody = (): boolean => {
  if (!formData.value.body.trim()) {
    errors.value.body = 'Body is required';
    return false;
  }
  if (formData.value.body.trim().length < 10) {
    errors.value.body = 'Body must be at least 10 characters';
    return false;
  }
  if (formData.value.body.trim().length > 1000) {
    errors.value.body = 'Body must be less than 1000 characters';
    return false;
  }
  errors.value.body = '';
  return true;
};

const validateUserId = (): boolean => {
  if (!formData.value.userId) {
    errors.value.userId = 'Please select an author';
    return false;
  }
  errors.value.userId = '';
  return true;
};

const validateForm = (): boolean => {
  const isTitleValid = validateTitle();
  const isBodyValid = validateBody();
  const isUserIdValid = validateUserId();
  return isTitleValid && isBodyValid && isUserIdValid;
};

// Load users on mount
onMounted(async () => {
  users.value = await usersApi.getAll();
});

// Watch for post changes to pre-fill form
watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      formData.value = {
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId.toString(),
      };
      // Clear errors when switching to edit mode
      errors.value = {
        title: '',
        body: '',
        userId: '',
      };
    } else {
      // Reset form when creating new post
      formData.value = {
        title: '',
        body: '',
        userId: '',
      };
      errors.value = {
        title: '',
        body: '',
        userId: '',
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  // Add a small delay for smooth animation
  await new Promise(resolve => setTimeout(resolve, 200));
  
  emit('save', {
    title: formData.value.title.trim(),
    body: formData.value.body.trim(),
    userId: parseInt(formData.value.userId),
  });
  
  isSubmitting.value = false;
};

const submitForm = () => {
  if (formRef.value) {
    formRef.value.requestSubmit();
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-enter-to .relative,
.modal-leave-from .relative {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
