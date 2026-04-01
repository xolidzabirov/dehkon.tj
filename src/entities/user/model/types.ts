import type { PaginationParams } from '@/shared/types';

export interface User {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  marketId?: number | null;
  profilePhotoUrl?: string | null;
  createdAt: string;
}

export interface UserFilterParams extends PaginationParams {
  RoleId?: number;
  UserName?: string;
  Email?: string;
  FullName?: string;
  IsActive?: boolean;
}
