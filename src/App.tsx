import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, Dashboard, ProductsPage, AddProductPage, EditProductPage, ViewProductPage, NewSalePage, SalesPage, UsersPage, AddUserPage, EditUserPage } from './pages';
import { ProtectedRoute, Layout } from './components';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas con Layout (Sidebar + Header) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="/products/edit/:id" element={<EditProductPage />} />
          <Route path="/products/view/:id" element={<ViewProductPage />} />
          <Route path="/categories" element={<div style={{ padding: '40px' }}>Categorías - Próximamente</div>} />
          <Route path="/inventory" element={<div style={{ padding: '40px' }}>Inventario - Próximamente</div>} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/customers" element={<div style={{ padding: '40px' }}>Clientes - Próximamente</div>} />
          <Route path="/reports" element={<div style={{ padding: '40px' }}>Reportes - Próximamente</div>} />
          <Route path="/settings" element={<div style={{ padding: '40px' }}>Configuración - Próximamente</div>} />
          
          {/* Rutas de usuarios - Solo para administradores */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/add" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AddUserPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/edit/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <EditUserPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Redirigir ruta raíz a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta 404 - Redirigir a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

