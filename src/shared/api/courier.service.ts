import apiClient from './client';
import type { Order, PaginatedResponse, PaginationParams } from '@/shared/types';

export const courierService = {
  getAvailableOrders: async (params?: PaginationParams): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get('/api/couriers/orders/available', { params });
    return response.data;
  },
  takeOrder: async (orderId: number): Promise<void> => {
    await apiClient.post(`/api/couriers/orders/${orderId}/take`);
  },
  deliverOrder: async (orderId: number): Promise<void> => {
    await apiClient.post(`/api/couriers/orders/${orderId}/deliver`);
  },
  getMyOrders: async (params?: PaginationParams): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get('/api/couriers/orders/my', { params });
    return response.data;
  },
};
