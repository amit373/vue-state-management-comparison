/**
 * Axios wrapper for JSONPlaceholder API
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { Post, CreatePostDto, UpdatePostDto, User } from '@vue-state-lab/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle API errors
 */
function handleError(error: AxiosError): never {
  if (error.response) {
    // Server responded with error status
    throw new Error(
      `API Error: ${error.response.status} - ${error.response.statusText}`
    );
  } else if (error.request) {
    // Request made but no response
    throw new Error('Network Error: No response from server');
  } else {
    // Something else happened
    throw new Error(`Error: ${error.message}`);
  }
}

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Get all posts
   */
  async getAll(): Promise<Post[]> {
    try {
      const response = await apiClient.get<Post[]>('/posts');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  /**
   * Get post by ID
   */
  async getById(id: number): Promise<Post> {
    try {
      const response = await apiClient.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  /**
   * Create new post
   */
  async create(data: CreatePostDto): Promise<Post> {
    try {
      const response = await apiClient.post<Post>('/posts', data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  /**
   * Update post
   */
  async update(id: number, data: UpdatePostDto): Promise<Post> {
    try {
      const response = await apiClient.put<Post>(`/posts/${id}`, {
        ...data,
        id,
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  /**
   * Delete post
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

/**
 * Export API client for custom requests
 */
export { apiClient };

