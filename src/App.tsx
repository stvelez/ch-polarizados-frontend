import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, Dashboard, ProductsPage, AddProductPage, EditProductPage, ViewProductPage } from './pages';
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
          <Route path="/sales" element={<div style={{ padding: '40px' }}>Ventas - Próximamente</div>} />
          <Route path="/customers" element={<div style={{ padding: '40px' }}>Clientes - Próximamente</div>} />
          <Route path="/reports" element={<div style={{ padding: '40px' }}>Reportes - Próximamente</div>} />
          <Route path="/settings" element={<div style={{ padding: '40px' }}>Configuración - Próximamente</div>} />
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

