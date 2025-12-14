import api from "./api.service";
import type { User, CreateUserDto, UpdateUserDto } from "../features/users/types/user.types";

export interface UsersResponse {
  data: User[];
}   

export interface UserResponse {
  data: User;   
}

export const usersService = {
  // Obtener todos los usuarios
  getAll: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/users");
    return response.data;
  },

  // Obtener un usuario por ID
  getById: async (id: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  create: async (userData: CreateUserDto): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/users", userData);
    return response.data;
  },

  // Actualizar un usuario
  update: async (id: string, userData: UpdateUserDto): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar un usuario
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Activar/Desactivar usuario
  toggleActive: async (id: string): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(`/users/${id}/toggle-active`);
    return response.data;
  },
};
