<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Posts
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Manage and explore all your posts
        </p>
      </div>
      <button
        class="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-150 flex items-center gap-2 shadow-sm hover:shadow"
        @click="showCreateModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Post
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative">
          <Input
            v-model="searchQuery"
            placeholder="Search posts by title or content..."
            class="pl-10"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Select
          :model-value="selectedUserId?.toString() || ''"
          :options="userOptions"
          placeholder="Filter by author..."
          @update:model-value="handleFilter"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <PostCardSkeleton
        v-for="n in 8"
        :key="`skeleton-${n}`"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-800 dark:text-red-400 text-sm font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Posts Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <PostCard
        v-for="(post, index) in paginatedPosts"
        :key="post.id"
        :post="post"
        :style="{ animationDelay: `${index * 0.03}s` }"
        class="animate-fade-in-up"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error && paginatedPosts && paginatedPosts.length > 0" class="flex justify-center pt-4">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="filteredPosts?.length || 0"
        :limit="store.postsPerPage"
        @prev="handlePrevPage"
        @next="handleNextPage"
        @change="setCurrentPage"
        @change-limit="store.setPostsPerPage"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && !error && (!paginatedPosts || paginatedPosts.length === 0)"
      class="text-center py-20"
    >
      <div class="max-w-md mx-auto">
        <svg class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No posts found</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {{ searchQuery || selectedUserId ? 'Try adjusting your filters' : 'Get started by creating your first post' }}
        </p>
        <button
          v-if="!searchQuery && !selectedUserId"
          class="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-150 shadow-sm hover:shadow"
          @click="showCreateModal = true"
        >
          Create Your First Post
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <PostModal
      v-if="showCreateModal || editingPost"
      :post="editingPost"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Toast Container -->
    <ToastContainerWrapper :toasts="toasts" @remove="removeToast" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from '@vue-state-lab/utils';
import type { Post } from '@vue-state-lab/types';
// These imports are used in the template
import {
  Input,
  Select,
  Pagination,
} from '@vue-state-lab/ui';
import { PostCard, PostModal, PostCardSkeleton } from '@vue-state-lab/ui';
import { usePostsStore } from '../stores/posts';
import { ToastContainerWrapper } from '@vue-state-lab/ui';

const store = usePostsStore();

const showCreateModal = ref(false);
const editingPost = ref<Post | null>(null);

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value: string) => { store.searchQuery = value; },
});
const selectedUserId = computed({
  get: () => store.selectedUserId,
  set: (value: number | null) => { store.selectedUserId = value; },
});
const currentPage = computed(() => store.currentPage);
const toasts = computed(() => store.toasts);
const userOptions = computed(() => store.userOptions);
const filteredPosts = computed(() => store.filteredPosts || []);
const paginatedPosts = computed(() => store.paginatedPosts || []);
const totalPages = computed(() => store.totalPages);

// Watch searchQuery changes and trigger search
const debouncedHandleSearch = debounce(() => {
  store.handleSearch();
}, 300);

watch(searchQuery, () => {
  debouncedHandleSearch();
});

const handleFilter = (value: string | number) => {
  const userId = value === '' ? null : Number(value);
  store.selectedUserId = userId;
  store.handleFilter();
};

const handleEdit = (post: Post) => {
  editingPost.value = { ...post };
};

const handleDelete = (id: number) => {
  store.handleDelete(id);
};

const handleSave = async (postData: { title: string; body: string; userId: number }) => {
  await store.handleSave(postData, editingPost.value);
  closeModal();
};

const closeModal = () => {
  showCreateModal.value = false;
  editingPost.value = null;
};

const handlePrevPage = () => {
  if (currentPage.value > 1) store.setCurrentPage(currentPage.value - 1);
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) store.setCurrentPage(currentPage.value + 1);
};

const setCurrentPage = (page: number) => {
  store.setCurrentPage(page);
};

const removeToast = (id: string) => {
  store.removeToast(id);
};

onMounted(() => {
  store.fetchPosts();
  store.fetchUsers();
});
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out both;
}
</style>
