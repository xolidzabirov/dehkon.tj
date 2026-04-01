export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewCreateInfo {
  productId: number;
  rating: number;
  comment: string;
}
