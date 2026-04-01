import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Review, ReviewCreateInfo } from '../model/types';
import type { PaginationParams } from '@/shared/types';

export const reviewService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get('/api/reviews', { params });
    return extractList<Review>(response.data);
  },
  getByProduct: async (productId: number, params?: PaginationParams) => {
    const response = await apiClient.get(`/api/reviews/product/${productId}`, { params });
    return extractList<Review>(response.data);
  },
  create: async (data: ReviewCreateInfo): Promise<Review> => {
    const response = await apiClient.post('/api/reviews', data);
    return extractOne<Review>(response.data);
  },
  update: async (id: number, data: { rating: number; comment: string }): Promise<void> => {
    await apiClient.put(`/api/reviews/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/reviews/${id}`);
  },
};
