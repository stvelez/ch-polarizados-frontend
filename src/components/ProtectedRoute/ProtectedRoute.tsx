import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // TODO: Implementar lógica de autenticación real
  // Por ahora, verificamos si hay un token en localStorage
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};
