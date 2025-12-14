import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  // Verificar autenticación
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole) {
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
      return <Navigate to="/login" replace />;
    }

    try {
      const userData = JSON.parse(userDataStr);
      const userRole = userData.role;

      // Si requiere rol de admin y el usuario no es admin, redirigir
      if (requiredRole === 'admin' && userRole !== 'admin') {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};
