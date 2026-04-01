import apiClient from './client';
import type { Chat, Message, PaginationParams, PaginatedResponse } from '@/shared/types';

export const chatService = {
  createPrivate: async (otherUserId: number): Promise<Chat> => {
    const response = await apiClient.post('/api/chats/private', { otherUserId });
    return response.data;
  },
  getMy: async (): Promise<Chat[]> => {
    const response = await apiClient.get('/api/chats/my');
    return response.data;
  },
  getById: async (id: number): Promise<Chat> => {
    const response = await apiClient.get(`/api/chats/${id}`);
    return response.data;
  },
  getGlobal: async (): Promise<Chat> => {
    const response = await apiClient.get('/api/chats/global');
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/chats/${id}`);
  },
};

export const messageService = {
  send: async (chatId: number, text: string): Promise<Message> => {
    const response = await apiClient.post('/api/messages', { chatId, text });
    return response.data;
  },
  getByChatId: async (chatId: number, params?: PaginationParams): Promise<PaginatedResponse<Message>> => {
    const response = await apiClient.get(`/api/messages/chat/${chatId}`, { params });
    return response.data;
  },
  markRead: async (chatId: number): Promise<void> => {
    await apiClient.put(`/api/messages/chat/${chatId}/read`);
  },
};
