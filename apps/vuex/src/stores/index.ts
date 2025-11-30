/**
 * Vuex store for state management
 */

// @ts-ignore - Vuex types issue with package.json exports
import { createStore } from 'vuex';
import { postsApi, usersApi } from '@vue-state-lab/api';
import type { Post, User, Toast } from '@vue-state-lab/types';
import { filterPosts, paginate, generateId } from '@vue-state-lab/utils';

interface State {
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

export default createStore<State>({
  state: {
    posts: [],
    users: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedUserId: null,
    currentPage: 1,
    postsPerPage: 12,
    toasts: [],
  },

  getters: {
    userOptions: (state: State) => [
      { value: '', label: 'All Users' },
      ...state.users.map((user: User) => ({
        value: user.id.toString(),
        label: user.name,
      })),
    ],

    filteredPosts: (state: State) => {
      return filterPosts(state.posts, state.searchQuery, state.selectedUserId);
    },

    paginatedPosts: (state: State, getters: any) => {
      const result = paginate(getters.filteredPosts, state.currentPage, state.postsPerPage);
      return result.data;
    },

    totalPages: (state: State, getters: any) => {
      const result = paginate(getters.filteredPosts, state.currentPage, state.postsPerPage);
      return result.totalPages;
    },
  },

  mutations: {
    SET_POSTS(state: State, posts: Post[]) {
      state.posts = posts;
    },

    SET_USERS(state: State, users: User[]) {
      state.users = users;
    },

    SET_LOADING(state: State, loading: boolean) {
      state.loading = loading;
    },

    SET_ERROR(state: State, error: string | null) {
      state.error = error;
    },

    SET_SEARCH_QUERY(state: State, query: string) {
      state.searchQuery = query;
    },

    SET_SELECTED_USER_ID(state: State, userId: number | null) {
      state.selectedUserId = userId;
    },

    SET_CURRENT_PAGE(state: State, page: number) {
      state.currentPage = page;
    },

    SET_POSTS_PER_PAGE(state: State, limit: number) {
      state.postsPerPage = limit;
      state.currentPage = 1; // Reset to first page when changing limit
    },

    ADD_POST(state: State, post: Post) {
      state.posts.unshift(post);
    },

    UPDATE_POST(state: State, post: Post) {
      const index = state.posts.findIndex((p: Post) => p.id === post.id);
      if (index !== -1) {
        state.posts[index] = post;
      }
    },

    DELETE_POST(state: State, id: number) {
      state.posts = state.posts.filter((p: Post) => p.id !== id);
    },

    ADD_TOAST(state: State, toast: Toast) {
      state.toasts.push(toast);
    },

    REMOVE_TOAST(state: State, id: string) {
      state.toasts = state.toasts.filter((t: Toast) => t.id !== id);
    },
  },

  actions: {
    async fetchPosts({ commit }: any) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const posts = await postsApi.getAll();
        commit('SET_POSTS', posts);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch posts';
        commit('SET_ERROR', error);
        commit('ADD_TOAST', {
          id: generateId(),
          message: 'Failed to fetch posts',
          type: 'error',
          duration: 3000,
        });
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchUsers({ commit }: any) {
      try {
        const users = await usersApi.getAll();
        commit('SET_USERS', users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    },

    handleSearch({ commit }: any) {
      commit('SET_CURRENT_PAGE', 1);
      // Debounce is handled in component
    },

    handleFilter({ commit }: any) {
      commit('SET_CURRENT_PAGE', 1);
    },

    async deletePost({ commit }: any, id: number) {
      if (!confirm('Are you sure you want to delete this post?')) return;

      try {
        await postsApi.delete(id);
        commit('DELETE_POST', id);
        commit('ADD_TOAST', {
          id: generateId(),
          message: 'Post deleted successfully',
          type: 'success',
          duration: 3000,
        });
      } catch (err) {
        commit('ADD_TOAST', {
          id: generateId(),
          message: 'Failed to delete post',
          type: 'error',
          duration: 3000,
        });
      }
    },

    async savePost({ commit }: any, { postData, editingPost }: { postData: { title: string; body: string; userId: number }; editingPost?: Post | null }) {
      try {
        if (editingPost) {
          const updated = await postsApi.update(editingPost.id, {
            title: postData.title,
            body: postData.body,
          });
          commit('UPDATE_POST', updated);
          commit('ADD_TOAST', {
            id: generateId(),
            message: 'Post updated successfully',
            type: 'success',
            duration: 3000,
          });
        } else {
          const newPost = await postsApi.create(postData);
          commit('ADD_POST', newPost);
          commit('ADD_TOAST', {
            id: generateId(),
            message: 'Post created successfully',
            type: 'success',
            duration: 3000,
          });
        }
      } catch (err) {
        commit('ADD_TOAST', {
          id: generateId(),
          message: 'Failed to save post',
          type: 'error',
          duration: 3000,
        });
      }
    },

    showToast({ commit }: any, { message, type = 'info' }: { message: string; type?: Toast['type'] }) {
      const toast: Toast = {
        id: generateId(),
        message,
        type,
        duration: 3000,
      };
      commit('ADD_TOAST', toast);
      setTimeout(() => {
        commit('REMOVE_TOAST', toast.id);
      }, toast.duration);
    },

    removeToast({ commit }: any, id: string) {
      commit('REMOVE_TOAST', id);
    },

    setPostsPerPage({ commit }: any, limit: number) {
      commit('SET_POSTS_PER_PAGE', limit);
    },
  },
});

