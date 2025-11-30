/**
 * Custom Event-based store for state management
 */

import { reactive, computed } from 'vue';
import { postsApi, usersApi } from '@vue-state-lab/api';
import type { Post, User, Toast } from '@vue-state-lab/types';
import { filterPosts, paginate, generateId } from '@vue-state-lab/utils';

type EventType = 'posts:updated' | 'users:updated' | 'loading:changed' | 'error:changed' | 'toast:added' | 'toast:removed';

class PostsStore {
  private state = reactive({
    posts: [] as Post[],
    users: [] as User[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
    selectedUserId: null as number | null,
    currentPage: 1,
    postsPerPage: 12,
    toasts: [] as Toast[],
  });

  private listeners: Map<EventType, Set<(payload?: any) => void>> = new Map();

  // Getters
  get posts() {
    return this.state.posts;
  }

  get users() {
    return this.state.users;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  get searchQuery() {
    return this.state.searchQuery;
  }

  get selectedUserId() {
    return this.state.selectedUserId;
  }

  get currentPage() {
    return this.state.currentPage;
  }

  get postsPerPage() {
    return this.state.postsPerPage;
  }

  get toasts() {
    return this.state.toasts;
  }

  get userOptions() {
    return computed(() => [
      { value: '', label: 'All Users' },
      ...this.state.users.map((user) => ({
        value: user.id.toString(),
        label: user.name,
      })),
    ]);
  }

  get filteredPosts() {
    return computed(() =>
      filterPosts(this.state.posts, this.state.searchQuery, this.state.selectedUserId)
    );
  }

  get paginatedPosts() {
    return computed(() => {
      const result = paginate(this.filteredPosts.value, this.state.currentPage, this.state.postsPerPage);
      return result.data;
    });
  }

  get totalPages() {
    return computed(() => {
      const result = paginate(this.filteredPosts.value, this.state.currentPage, this.state.postsPerPage);
      return result.totalPages;
    });
  }

  // Event system
  on(event: EventType, callback: (payload?: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: EventType, payload?: any) {
    this.listeners.get(event)?.forEach((callback) => callback(payload));
  }

  // Actions
  async fetchPosts() {
    this.state.loading = true;
    this.state.error = null;
    this.emit('loading:changed', true);
    try {
      this.state.posts = await postsApi.getAll();
      this.emit('posts:updated', this.state.posts);
    } catch (err) {
      this.state.error = err instanceof Error ? err.message : 'Failed to fetch posts';
      this.emit('error:changed', this.state.error);
      this.showToast('Failed to fetch posts', 'error');
    } finally {
      this.state.loading = false;
      this.emit('loading:changed', false);
    }
  }

  async fetchUsers() {
    try {
      this.state.users = await usersApi.getAll();
      this.emit('users:updated', this.state.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }

  setSearchQuery(query: string) {
    this.state.searchQuery = query;
    this.state.currentPage = 1;
  }

  setSelectedUserId(userId: number | null) {
    this.state.selectedUserId = userId;
    this.state.currentPage = 1;
  }

  setCurrentPage(page: number) {
    this.state.currentPage = page;
  }

  setPostsPerPage(limit: number) {
    this.state.postsPerPage = limit;
    this.state.currentPage = 1; // Reset to first page when changing limit
  }

  async deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsApi.delete(id);
      this.state.posts = this.state.posts.filter((p) => p.id !== id);
      this.emit('posts:updated', this.state.posts);
      this.showToast('Post deleted successfully', 'success');
    } catch (err) {
      this.showToast('Failed to delete post', 'error');
    }
  }

  async savePost(postData: { title: string; body: string; userId: number }, editingPost?: Post | null) {
    try {
      if (editingPost) {
        const updated = await postsApi.update(editingPost.id, {
          title: postData.title,
          body: postData.body,
        });
        const index = this.state.posts.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          this.state.posts[index] = updated;
        }
        this.emit('posts:updated', this.state.posts);
        this.showToast('Post updated successfully', 'success');
      } else {
        const newPost = await postsApi.create(postData);
        this.state.posts.unshift(newPost);
        this.emit('posts:updated', this.state.posts);
        this.showToast('Post created successfully', 'success');
      }
    } catch (err) {
      this.showToast('Failed to save post', 'error');
    }
  }

  showToast(message: string, type: Toast['type'] = 'info') {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration: 3000,
    };
    this.state.toasts.push(toast);
    this.emit('toast:added', toast);
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.duration);
  }

  removeToast(id: string) {
    this.state.toasts = this.state.toasts.filter((t) => t.id !== id);
    this.emit('toast:removed', id);
  }
}

// Singleton instance
export const postsStore = new PostsStore();

