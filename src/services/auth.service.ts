import api from "./api.service";

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


export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>(
        "/users/login",
        credentials
      );

      localStorage.setItem("authToken", response.data.token);

      return response.data;
    } catch (error: unknown) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    }
  },

  logout: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  },

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
};
