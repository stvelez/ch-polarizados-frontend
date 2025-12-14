import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from '../../../../components';
import { ProductCard } from '../ProductCard/ProductCard';
import { productsService } from '../../../../services/products.service';
import type { Product } from '../../types/product.types';
import './ProductList.scss';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll();
      console.log('Response from API:', response);
      console.log('Type of response:', typeof response);
      console.log('Is Array?:', Array.isArray(response));
      
      // Asegurarse de que response sea un array
      if (Array.isArray(response)) {
        console.log('Setting products as array, length:', response.length);
        setProducts(response);
      } else if (response && typeof response === 'object' && 'products' in response) {
        // Si la respuesta tiene una propiedad 'products' que es un array
        console.log('Setting products from response.products');
        const productsArray = (response as any).products;
        setProducts(Array.isArray(productsArray) ? productsArray : []);
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Si la respuesta tiene una propiedad 'data' que es un array
        console.log('Setting products from response.data');
        const dataArray = (response as any).data;
        setProducts(Array.isArray(dataArray) ? dataArray : []);
      } else {
        console.error('Response is not an array or expected object:', response);
        setProducts([]);
      }
    } catch (erro) {
      console.error('Error fetching products:', erro);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleView = (id: string) => {
    navigate(`/products/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await productsService.delete(id);
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  console.log('Products state before filter:', products);
  console.log('Is products an array?:', Array.isArray(products));

  const filteredProducts = Array.isArray(products) 
    ? products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
      })
    : [];

  return (
    <div className="product-list">
      <div className="product-list__header">
        <div className="header-content">
          <h1 className="header-title">Gestión de Productos</h1>
          <p className="header-subtitle">
            Administra tu inventario de productos de manera eficiente
          </p>
        </div>
        <Button variant="primary" onClick={handleAddProduct}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar Producto
        </Button>
      </div>

      <div className="product-list__filters">
        <div className="filter-info">
          <div className="info-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </div>
          <div>
            <h3 className="filter-title">Gestión de Productos</h3>
            <p className="filter-count">{filteredProducts.length} productos registrados</p>
          </div>
        </div>

        <div className="filter-controls">
          <Input
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            }
          />

          <div className="filter-info-text">
            <span className="filter-help-text">Busca por nombre, descripción, SKU o ID</span>
          </div>
        </div>
      </div>

      <div className="product-list__table">
        {loading ? (
          <div className="table-loading">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="table-empty">No se encontraron productos</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>SKU</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
