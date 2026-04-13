import { User } from '@/types/user';

export interface AuthResponse {
  message: string;
  user?: User;
  expiresAt: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  onboarding_completed?: boolean;
}
