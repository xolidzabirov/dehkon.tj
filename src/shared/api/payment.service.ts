import apiClient from './client';

export const paymentService = {
  createPayment: async (orderId: number): Promise<any> => {
    const response = await apiClient.post(`/api/payments/orders/${orderId}`);
    return response.data;
  },
};
