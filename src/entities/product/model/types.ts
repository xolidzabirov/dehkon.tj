import type { PaginationParams } from '@/shared/types';

export interface Product {
  id: number;
  name: string;
  description: string;
  pricePerKg: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  sellerName: string;
  marketId: number;
  marketName: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductFilterParams extends PaginationParams {
  CategoryId?: number;
  SellerId?: number;
  MarketId?: number;
  MinPrice?: number;
  MaxPrice?: number;
  InStock?: boolean;
  Name?: string;
}
