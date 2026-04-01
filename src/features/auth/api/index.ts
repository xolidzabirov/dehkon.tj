import apiClient from '@/shared/api/client';
import type { LoginRequest, RegisterRequest, LoginResponse, ChangePasswordRequest } from '../model/types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },
  deleteMyAccount: async (): Promise<void> => {
    await apiClient.delete('/api/auth/me');
  },
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/api/auth/change-password', data);
  },
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },
  changeUserPassword: async (id: number, data: { newPassword: string; confirmPassword: string }): Promise<void> => {
    await apiClient.put(`/api/users/${id}/change-password`, data);
  },
};
