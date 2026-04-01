import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Category } from '../model/types';
import type { PaginationParams } from '@/shared/types';

export const categoryService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get('/api/categories', { params });
    return extractList<Category>(response.data);
  },
  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return extractOne<Category>(response.data);
  },
  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await apiClient.post('/api/categories', data);
    return extractOne<Category>(response.data);
  },
  update: async (id: number, data: { name: string; description?: string }): Promise<void> => {
    await apiClient.put(`/api/categories/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};
