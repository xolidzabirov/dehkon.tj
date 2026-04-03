// src/shared/api/auth.ts
import apiClient from './client';

export const authApi = {
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.put('/api/auth/change-password', data),

  deleteMe: () =>
    apiClient.delete('/api/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; max-age=0; path=/';
  },
};
