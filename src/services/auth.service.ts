import api from "./api.service";

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipos basados en el modelo User de Prisma
export interface User {
  id: string; // UUID
  email: string;
  name: string;
  role: string; // admin, user, etc.
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
    };
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
  role: string;
  isActive: boolean;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      console.log("Respuesta de login:", response.data.data);
      // Guardar token y datos del usuario
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.data.user));

      return response.data;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    }
  },

  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },

  getCurrentUser: (): AuthUser | null => {
    const token = localStorage.getItem("authToken");
    const userDataStr = localStorage.getItem("userData");

    if (!token || !userDataStr) {
      return null;
    }

    try {
      const userData = JSON.parse(userDataStr);
      return {
        ...userData,
        token,
      };
    } catch {
      return null;
    }
  },
};
