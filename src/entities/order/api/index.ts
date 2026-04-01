import apiClient from '@/shared/api/client';
import { extractList, extractOne } from '@/shared/api/helpers';
import type { Order, OrderCreateInfo, OrderFilterParams } from '../model/types';

export const orderService = {
  create: async (data: OrderCreateInfo): Promise<Order> => {
    const response = await apiClient.post('/api/orders', data);
    return extractOne<Order>(response.data);
  },
  getAll: async (params?: OrderFilterParams) => {
    const response = await apiClient.get('/api/orders', { params });
    return extractList<Order>(response.data);
  },
  getMy: async (params?: OrderFilterParams) => {
    const response = await apiClient.get('/api/orders/my', { params });
    return extractList<Order>(response.data);
  },
  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return extractOne<Order>(response.data);
  },
  updateStatus: async (id: number, status: number): Promise<void> => {
    await apiClient.put(`/api/orders/${id}/status`, { status });
  },
};
