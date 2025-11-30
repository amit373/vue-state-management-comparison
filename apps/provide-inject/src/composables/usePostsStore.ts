/**
 * Provide/Inject pattern for state management
 * State is provided at the root and injected in child components
 */

import { provide, inject, ref, computed, type Ref } from 'vue';
import { postsApi, usersApi } from '@vue-state-lab/api';
import type { Post, User, Toast } from '@vue-state-lab/types';
import { filterPosts, paginate, debounce, generateId } from '@vue-state-lab/utils';

const PostsStoreKey = Symbol('posts-store');

interface PostsStore {
  posts: Ref<Post[]>;
  users: Ref<User[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  searchQuery: Ref<string>;
  selectedUserId: Ref<number | null>;
  currentPage: Ref<number>;
  postsPerPage: Ref<number>;
  toasts: Ref<Toast[]>;
  filteredPosts: Ref<Post[]>;
  paginatedPosts: Ref<Post[]>;
  totalPages: Ref<number>;
  userOptions: Ref<Array<{ value: string; label: string }>>;
  fetchPosts: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  handleSearch: () => void;
  handleFilter: () => void;
  handleDelete: (id: number) => Promise<void>;
  handleSave: (postData: { title: string; body: string; userId: number }, editingPost?: Post | null) => Promise<void>;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setPostsPerPage: (limit: number) => void;
}

export function providePostsStore() {
  const posts = ref<Post[]>([]);
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');
  const selectedUserId = ref<number | null>(null);
  const currentPage = ref(1);
  const postsPerPage = ref(12);
  const toasts = ref<Toast[]>([]);

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

  const store: PostsStore = {
    posts,
    users,
    loading,
    error,
    searchQuery,
    selectedUserId,
    currentPage,
    postsPerPage,
    toasts,
    filteredPosts,
    paginatedPosts,
    totalPages,
    userOptions,
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

  provide(PostsStoreKey, store);
  return store;
}

export function usePostsStore(): PostsStore {
  const store = inject<PostsStore>(PostsStoreKey);
  if (!store) {
    throw new Error('PostsStore not provided. Make sure to call providePostsStore() in a parent component.');
  }
  return store;
}

