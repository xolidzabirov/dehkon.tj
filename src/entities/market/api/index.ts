import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Market } from '../model/types';
import type { PaginationParams } from '@/shared/types';

export const marketService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get('/api/markets', { params });
    return extractList<Market>(response.data);
  },
  getById: async (id: number): Promise<Market> => {
    const response = await apiClient.get(`/api/markets/${id}`);
    return extractOne<Market>(response.data);
  },
  create: async (data: { name: string; slug: string; address: string; latitude?: number; longitude?: number }): Promise<Market> => {
    const response = await apiClient.post('/api/markets', data);
    return extractOne<Market>(response.data);
  },
  update: async (id: number, data: { name: string; slug: string; address: string; latitude?: number; longitude?: number }): Promise<void> => {
    await apiClient.put(`/api/markets/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/markets/${id}`);
  },
};
