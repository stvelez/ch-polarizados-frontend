import { useState, useEffect, useCallback } from 'react';
import { Button, Input } from '../../../../components';
import { ProductCard } from '../ProductCard/ProductCard';
import { productsService } from '../../../../services/products.service';
import type { Product } from '../../types/product.types';
import './ProductList.scss';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsService.getAll();
      setProducts(response);
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

  const handleView = (id: number) => {
    navigate(`/products/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    await productsService.delete(id);
    fetchProducts();
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }) || [];

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

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">Todas las categorías</option>
              <option value="Cuidado automotriz">Cuidado automotriz</option>
              <option value="Lujo">Lujo</option>
              <option value="Servicio">Servicio</option>
            </select>
          </div>
        </div>
      </div>

      <div className="product-list__table">
        <div className="table-header">
          <div className="header-cell">PRODUCTO</div>
          <div className="header-cell">CATEGORÍA</div>
          <div className="header-cell">PRECIO</div>
          <div className="header-cell">ESTADO</div>
          <div className="header-cell">ACCIONES</div>
        </div>

        {loading ? (
          <div className="table-loading">Cargando productos...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="table-empty">No se encontraron productos</div>
        ) : (
          <div className="table-body">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
