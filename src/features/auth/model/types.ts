export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  marketId?: number | null;
  role?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
}
