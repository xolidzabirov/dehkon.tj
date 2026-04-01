import apiClient from './client';
import type { Cart, CartItemCreateInfo, CartItemUpdateInfo } from '@/shared/types';

export const cartService = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get('/api/cart');
    return response.data;
  },
  addItem: async (data: CartItemCreateInfo): Promise<void> => {
    await apiClient.post('/api/cart/items', data);
  },
  updateItem: async (itemId: number, data: CartItemUpdateInfo): Promise<void> => {
    await apiClient.put(`/api/cart/items/${itemId}`, data);
  },
  removeItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/api/cart/items/${itemId}`);
  },
  clear: async (): Promise<void> => {
    await apiClient.delete('/api/cart/clear');
  },
};
