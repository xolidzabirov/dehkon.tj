import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Product, ProductFilterParams } from '../model/types';

export const productService = {
  getAll: async (params?: ProductFilterParams) => {
    const response = await apiClient.get('/api/products', { params });
    return extractList<Product>(response.data);
  },
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/api/products/${id}`);
    return extractOne<Product>(response.data);
  },
  create: async (data: FormData): Promise<Product> => {
    const response = await apiClient.post('/api/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractOne<Product>(response.data);
  },
  update: async (data: FormData): Promise<Product> => {
    const response = await apiClient.put('/api/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractOne<Product>(response.data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },
};
