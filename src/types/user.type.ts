export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
}

export type UserRole = 'admin' | 'user';