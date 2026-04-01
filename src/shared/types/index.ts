export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface PaginationParams {
  PageSize?: number;
  PageNumber?: number;
}

export interface ApiWrapper<T> {
  isSuccess: boolean;
  error: { code: string | null; message: string | null; errorType: number };
  data: T;
}

// Re-exports for backward compatibility (canonical source is in entity/feature folders)
export type { Product, ProductFilterParams } from '@/entities/product/model/types';
export type { Category } from '@/entities/category/model/types';
export type { Market } from '@/entities/market/model/types';
export type { Order, OrderItem, OrderCreateInfo, OrderFilterParams, CourierOrder } from '@/entities/order/model/types';
export type { User, UserFilterParams } from '@/entities/user/model/types';
export type { Review, ReviewCreateInfo } from '@/entities/review/model/types';
export type { Announcement } from '@/entities/announcement/model/types';
export type { Chat, ChatParticipant, Message } from '@/entities/chat/model/types';
export type { Role } from '@/entities/role/model/types';
export type { Payment } from '@/entities/payment/model/types';
export type { Cart, CartItem, CartItemCreateInfo, CartItemUpdateInfo } from '@/features/cart/model/types';
export type { LoginRequest, RegisterRequest, LoginResponse, ChangePasswordRequest } from '@/features/auth/model/types';
