/**
 * Vue composable to use RxJS store with Vue reactivity
 */

import { ref, onUnmounted } from 'vue';
import { postsStore, posts$, users$, loading$, error$, searchQuery$, selectedUserId$, currentPage$, postsPerPage$, toasts$, userOptions$, filteredPosts$, paginatedPosts$, totalPages$ } from '../stores/postsStore';
import type { Subscription } from 'rxjs';

export function useRxStore() {
  const posts = ref(postsStore.state.posts);
  const users = ref(postsStore.state.users);
  const loading = ref(postsStore.state.loading);
  const error = ref(postsStore.state.error);
  const searchQuery = ref(postsStore.state.searchQuery);
  const selectedUserId = ref(postsStore.state.selectedUserId);
  const currentPage = ref(postsStore.state.currentPage);
  const postsPerPage = ref(postsStore.state.postsPerPage);
  const toasts = ref(postsStore.state.toasts);
  const userOptions = ref(postsStore.state.users.map(u => ({ value: u.id.toString(), label: u.name })));
  const filteredPosts = ref(postsStore.state.posts);
  const paginatedPosts = ref(postsStore.state.posts);
  const totalPages = ref(1);

  const subscriptions: Subscription[] = [
    posts$.subscribe((value) => { posts.value = value; }),
    users$.subscribe((value) => { users.value = value; }),
    loading$.subscribe((value) => { loading.value = value; }),
    error$.subscribe((value) => { error.value = value; }),
    searchQuery$.subscribe((value) => { searchQuery.value = value; }),
    selectedUserId$.subscribe((value) => { selectedUserId.value = value; }),
    currentPage$.subscribe((value) => { currentPage.value = value; }),
    postsPerPage$.subscribe((value) => { postsPerPage.value = value; }),
    toasts$.subscribe((value) => { toasts.value = value; }),
    userOptions$.subscribe((value) => { userOptions.value = value; }),
    filteredPosts$.subscribe((value) => { filteredPosts.value = value; }),
    paginatedPosts$.subscribe((value) => { paginatedPosts.value = value; }),
    totalPages$.subscribe((value) => { totalPages.value = value; }),
  ];

  onUnmounted(() => {
    subscriptions.forEach((sub) => sub.unsubscribe());
  });

  return {
    posts,
    users,
    loading,
    error,
    searchQuery,
    selectedUserId,
    currentPage,
    postsPerPage,
    toasts,
    userOptions,
    filteredPosts,
    paginatedPosts,
    totalPages,
    store: postsStore,
  };
}

