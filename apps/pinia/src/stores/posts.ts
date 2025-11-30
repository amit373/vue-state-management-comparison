/**
 * Pinia store for state management
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { postsApi, usersApi } from '@vue-state-lab/api';
import type { Post, User, Toast } from '@vue-state-lab/types';
import { filterPosts, paginate, debounce, generateId } from '@vue-state-lab/utils';

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref<Post[]>([]);
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const selectedUserId = ref<number | null>(null);
  const currentPage = ref(1);
  const postsPerPage = ref(12);
  const toasts = ref<Toast[]>([]);

  // Getters
  const userOptions = computed(() => [
    { value: '', label: 'All Users' },
    ...users.value.map((user) => ({
      value: user.id.toString(),
      label: user.name,
    })),
  ]);

  const filteredPosts = computed(() => {
    return filterPosts(posts.value, searchQuery.value, selectedUserId.value);
  });

  const paginationResult = computed(() => {
    return paginate(filteredPosts.value, currentPage.value, postsPerPage.value);
  });

  const paginatedPosts = computed(() => paginationResult.value.data);
  const totalPages = computed(() => paginationResult.value.totalPages);

  // Actions
  const fetchPosts = async () => {
    loading.value = true;
    error.value = null;
    try {
      posts.value = await postsApi.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts';
      showToast('Failed to fetch posts', 'error');
    } finally {
      loading.value = false;
    }
  };

  const fetchUsers = async () => {
    try {
      users.value = await usersApi.getAll();
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const debouncedSearch = debounce(() => {
    currentPage.value = 1;
  }, 300);

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleFilter = () => {
    currentPage.value = 1;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsApi.delete(id);
      posts.value = posts.value.filter((p) => p.id !== id);
      showToast('Post deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete post', 'error');
    }
  };

  const handleSave = async (postData: { title: string; body: string; userId: number }, editingPost?: Post | null) => {
    try {
      if (editingPost) {
        const updated = await postsApi.update(editingPost.id, {
          title: postData.title,
          body: postData.body,
        });
        const index = posts.value.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          posts.value[index] = updated;
        }
        showToast('Post updated successfully', 'success');
      } else {
        const newPost = await postsApi.create(postData);
        posts.value.unshift(newPost);
        showToast('Post created successfully', 'success');
      }
    } catch (err) {
      showToast('Failed to save post', 'error');
    }
  };

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration: 3000,
    };
    toasts.value.push(toast);
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setPostsPerPage = (limit: number) => {
    postsPerPage.value = limit;
    currentPage.value = 1; // Reset to first page when changing limit
  };

  return {
    // State
    posts,
    users,
    loading,
    error,
    searchQuery,
    selectedUserId,
    currentPage,
    postsPerPage,
    toasts,
    // Getters
    userOptions,
    filteredPosts,
    paginatedPosts,
    totalPages,
    // Actions
    fetchPosts,
    fetchUsers,
    handleSearch,
    handleFilter,
    handleDelete,
    handleSave,
    showToast,
    removeToast,
    setCurrentPage,
    setPostsPerPage,
  };
});

