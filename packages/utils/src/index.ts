/**
 * Shared utility functions for vue-state-lab
 */

import type { Post } from '@vue-state-lab/types';

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Filter posts based on search query and user ID
 */
export function filterPosts(
  posts: Post[],
  search?: string | null,
  userId?: number | null
): Post[] {
  let filtered = [...posts];

  if (search && typeof search === 'string' && search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query)
    );
  }

  if (userId !== null && userId !== undefined) {
    filtered = filtered.filter((post) => post.userId === userId);
  }

  return filtered;
}

/**
 * Paginate array of items
 */
export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; totalPages: number } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);

  return { data, totalPages };
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export * from './useToast';

