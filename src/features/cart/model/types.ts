export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  pricePerKg: number;
  quantityKg: number;
  totalPrice: number;
}

export interface CartItemCreateInfo {
  productId: number;
  quantityKg: number;
}

export interface CartItemUpdateInfo {
  productId: number;
  quantityKg: number;
}
