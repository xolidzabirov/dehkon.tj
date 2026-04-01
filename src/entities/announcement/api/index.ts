import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Announcement } from '../model/types';
import type { PaginationParams } from '@/shared/types';

export const announcementService = {
  getAll: async (params?: PaginationParams) => {
    const response = await apiClient.get('/api/announcements', { params });
    return extractList<Announcement>(response.data);
  },
  create: async (data: { title: string; content: string }): Promise<Announcement> => {
    const response = await apiClient.post('/api/announcements', data);
    return extractOne<Announcement>(response.data);
  },
  update: async (id: number, data: { title: string; content: string }): Promise<void> => {
    await apiClient.put(`/api/announcements/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/announcements/${id}`);
  },
};
