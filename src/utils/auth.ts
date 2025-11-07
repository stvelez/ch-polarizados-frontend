// Utilidades de autenticación temporal
// TODO: Reemplazar con implementación real de backend

export const authUtils = {
  // Simular login
  login: (email: string, password: string): boolean => {
    // Validación básica para desarrollo
    if (email && password.length >= 6) {
      const mockToken = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('authToken') !== null;
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return {
      email: localStorage.getItem('userEmail') || '',
      token: localStorage.getItem('authToken') || '',
    };
  },
};
