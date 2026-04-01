import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { User, UserFilterParams } from '../model/types';

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/users/me');
    return extractOne<User>(response.data);
  },
  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/api/users/me', data);
    return extractOne<User>(response.data);
  },
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/api/users/${id}`);
    return extractOne<User>(response.data);
  },
  getAll: async (params?: UserFilterParams) => {
    const response = await apiClient.get('/api/users', { params });
    return extractList<User>(response.data);
  },
};
