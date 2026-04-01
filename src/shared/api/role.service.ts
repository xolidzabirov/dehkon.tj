import apiClient from './client';
import { extractList, extractOne } from './helpers';
import type { Role, PaginationParams } from '@/shared/types';

export const roleService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get('/api/roles', { params });
    return extractList<Role>(response.data);
  },
  getById: async (id: number): Promise<Role> => {
    const response = await apiClient.get(`/api/roles/${id}`);
    return extractOne<Role>(response.data);
  },
  create: async (data: { name: string; description: string }): Promise<Role> => {
    const response = await apiClient.post('/api/roles', data);
    return extractOne<Role>(response.data);
  },
  update: async (id: number, data: { name: string; description: string }): Promise<void> => {
    await apiClient.put(`/api/roles/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/roles/${id}`);
  },
};
