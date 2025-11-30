/**
 * RxJS store for state management
 */

import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { postsApi, usersApi } from '@vue-state-lab/api';
import type { Post, User, Toast } from '@vue-state-lab/types';
import { filterPosts, paginate, generateId } from '@vue-state-lab/utils';

interface PostsState {
  posts: Post[];
  users: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedUserId: number | null;
  currentPage: number;
  postsPerPage: number;
  toasts: Toast[];
}

const initialState: PostsState = {
  posts: [],
  users: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedUserId: null,
  currentPage: 1,
  postsPerPage: 12,
  toasts: [],
};

// State subjects
const state$ = new BehaviorSubject<PostsState>(initialState);

// Derived observables
export const posts$ = state$.pipe(map((state) => state.posts));
export const users$ = state$.pipe(map((state) => state.users));
export const loading$ = state$.pipe(map((state) => state.loading));
export const error$ = state$.pipe(map((state) => state.error));
export const searchQuery$ = state$.pipe(map((state) => state.searchQuery));
export const selectedUserId$ = state$.pipe(map((state) => state.selectedUserId));
export const currentPage$ = state$.pipe(map((state) => state.currentPage));
export const postsPerPage$ = state$.pipe(map((state) => state.postsPerPage));
export const toasts$ = state$.pipe(map((state) => state.toasts));

export const userOptions$ = combineLatest([users$]).pipe(
  map(([users]) => [
    { value: '', label: 'All Users' },
    ...users.map((user) => ({
      value: user.id.toString(),
      label: user.name,
    })),
  ])
);

export const filteredPosts$ = combineLatest([posts$, searchQuery$, selectedUserId$]).pipe(
  map(([posts, searchQuery, selectedUserId]) =>
    filterPosts(posts, searchQuery, selectedUserId)
  )
);

export const paginatedPosts$ = combineLatest([filteredPosts$, currentPage$, postsPerPage$]).pipe(
  map(([filteredPosts, currentPage, postsPerPage]) => {
    const result = paginate(filteredPosts, currentPage, postsPerPage);
    return result.data;
  })
);

export const totalPages$ = combineLatest([filteredPosts$, currentPage$, postsPerPage$]).pipe(
  map(([filteredPosts, currentPage, postsPerPage]) => {
    const result = paginate(filteredPosts, currentPage, postsPerPage);
    return result.totalPages;
  })
);

// Actions
function updateState(updater: (state: PostsState) => PostsState) {
  state$.next(updater(state$.value));
}

export const postsStore = {
  // Getters
  get state() {
    return state$.value;
  },

  // Actions
  async fetchPosts() {
    updateState((state) => ({ ...state, loading: true, error: null }));
    try {
      const posts = await postsApi.getAll();
      updateState((state) => ({ ...state, posts, loading: false }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch posts';
      updateState((state) => ({ ...state, error, loading: false }));
      postsStore.showToast('Failed to fetch posts', 'error');
    }
  },

  async fetchUsers() {
    try {
      const users = await usersApi.getAll();
      updateState((state) => ({ ...state, users }));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  },

  setSearchQuery(query: string) {
    updateState((state) => ({ ...state, searchQuery: query, currentPage: 1 }));
  },

  setSelectedUserId(userId: number | null) {
    updateState((state) => ({ ...state, selectedUserId: userId, currentPage: 1 }));
  },

  setCurrentPage(page: number) {
    updateState((state) => ({ ...state, currentPage: page }));
  },

  setPostsPerPage(limit: number) {
    updateState((state) => ({ ...state, postsPerPage: limit, currentPage: 1 }));
  },

  async deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsApi.delete(id);
      updateState((state) => ({
        ...state,
        posts: state.posts.filter((p) => p.id !== id),
      }));
      postsStore.showToast('Post deleted successfully', 'success');
    } catch (err) {
      postsStore.showToast('Failed to delete post', 'error');
    }
  },

  async savePost(postData: { title: string; body: string; userId: number }, editingPost?: Post | null) {
    try {
      if (editingPost) {
        const updated = await postsApi.update(editingPost.id, {
          title: postData.title,
          body: postData.body,
        });
        updateState((state) => {
          const index = state.posts.findIndex((p) => p.id === updated.id);
          const newPosts = [...state.posts];
          if (index !== -1) {
            newPosts[index] = updated;
          }
          return { ...state, posts: newPosts };
        });
        postsStore.showToast('Post updated successfully', 'success');
      } else {
        const newPost = await postsApi.create(postData);
        updateState((state) => ({
          ...state,
          posts: [newPost, ...state.posts],
        }));
        postsStore.showToast('Post created successfully', 'success');
      }
    } catch (err) {
      postsStore.showToast('Failed to save post', 'error');
    }
  },

  showToast(message: string, type: Toast['type'] = 'info') {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration: 3000,
    };
    updateState((state) => ({
      ...state,
      toasts: [...state.toasts, toast],
    }));
    setTimeout(() => {
      postsStore.removeToast(toast.id);
    }, toast.duration);
  },

  removeToast(id: string) {
    updateState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
};

