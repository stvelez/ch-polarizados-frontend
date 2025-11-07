import api from "./api.service";

// Tipos para el servicio de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface AuthUser {
  email: string;
  token: string;
  name?: string;
}

// Servicio de autenticación
export const authService = {
  /**
   * Método de login para autenticar usuarios
   * @param credentials - Credenciales del usuario (email y password)
   * @returns Promise con los datos del usuario autenticado
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(
        "/users/login",
        credentials
      );

      localStorage.setItem("authToken", response.data.token);

      return response.data;
    } catch (error: unknown) {
      throw new Error("Error al iniciar sesión");
    }
  },

  /**
   * Cerrar sesión
   */
  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem("authToken") !== null;
  },

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser: (): AuthUser | null => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    if (!token || !email) {
      return null;
    }

    return {
      email,
      token,
      name: name || undefined,
    };
  },

  /**
   * Verificar token con el backend
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      return response.status === 200;
    } catch {
      return false;
    }
  },
};
