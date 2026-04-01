import type { PaginationParams } from '@/shared/types';

export interface Order {
  id: number;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  courierId?: number | null;
  courierName?: string | null;
  deliveryAddress: string;
  status: number;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  pricePerKg: number;
  quantityKg: number;
  totalPrice: number;
}

export interface OrderCreateInfo {
  deliveryAddress: string;
}

export interface OrderFilterParams extends PaginationParams {
  Status?: number;
  BuyerId?: number;
  SellerId?: number;
  CourierId?: number;
  DateFrom?: string;
  DateTo?: string;
}

export interface CourierOrder extends Order {
  distance?: number;
}
