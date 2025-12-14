import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Input } from '../../components';
import type { Product } from '../../features/products/types/product.types';
import { productsService, salesService, type CreateSaleDto } from '../../services';
import './NewSalePage.scss';

interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const NewSalePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [clientName, setClientName] = useState('Cliente General');
  const [discount, setDiscount] = useState('0');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  // Obtener el número de turno
  const getTurnNumber = () => {
    return `#${Math.floor(Math.random() * 1000) + 100}`;
  };

  const [turnNumber] = useState(getTurnNumber());

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productsService.getAll();
        
        let productsArray: Product[] = [];
        
        // Manejar diferentes formatos de respuesta de la API
        if (Array.isArray(response)) {
          productsArray = response;
        } else if (response && typeof response === 'object' && 'data' in response) {
          productsArray = Array.isArray((response as any).data) ? (response as any).data : [];
        } else if (response && typeof response === 'object' && 'products' in response) {
          productsArray = Array.isArray((response as any).products) ? (response as any).products : [];
        }
        
        // Convertir precios de string a number si es necesario
        const normalizedProducts = productsArray.map(p => ({
          ...p,
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        })).filter(p => p.isActive);
        
        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Los productos vienen ya filtrados por categoría desde la API, así que Todos muestra todos
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const addProductToSale = (product: Product) => {
    const existingItem = saleItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      setSaleItems([
        ...saleItems,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
          total: product.price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSaleItems(
      saleItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQuantity,
              total: newQuantity * item.unitPrice,
            }
          : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setSaleItems(saleItems.filter((item) => item.product.id !== productId));
  };

  const calculateSubtotal = () => {
    return saleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = parseFloat(discount) || 0;
    return subtotal - discountAmount;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRegisterSale = async () => {
    if (saleItems.length === 0) {
      toast.error('Debes agregar al menos un producto a la venta');
      return;
    }

    if (!clientName.trim()) {
      toast.error('Debes ingresar el nombre del cliente');
      return;
    }

    try {
      setRegistering(true);

      // Construir el DTO de la venta
      const saleData: CreateSaleDto = {
        clientName: clientName.trim(),
        saleDate,
        paymentMethod,
        items: saleItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.total,
        })),
        subtotal: calculateSubtotal(),
        discount: parseFloat(discount) || 0,
        total: calculateTotal(),
        observations: observations.trim() || undefined,
      };

      console.log('Enviando venta a la API:', saleData);

      // Registrar la venta en el backend
      const response = await salesService.create(saleData);

      console.log('Venta registrada exitosamente:', response);
      toast.success(`¡Venta registrada exitosamente! Número: ${response.saleNumber}`);
      
      // Redirigir a la página de ventas después de 2 segundos
      setTimeout(() => {
        navigate('/sales');
      }, 2000);
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      toast.error('Error al registrar la venta. Por favor, intenta nuevamente.');
    } finally {
      setRegistering(false);
    }
  };

  const categories = ['Todos', 'Películas de Polarizado', 'Accesorios', 'Limpieza', 'Kits'];

  return (
    <div className="new-sale-page">
      <div className="new-sale-page__header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/sales')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Volver
          </button>
          <h1 className="header-title">Nueva venta</h1>
        </div>
        <Button variant="primary" onClick={handleRegisterSale}>
          + Producto
        </Button>
      </div>

      <div className="new-sale-page__content">
        {/* Panel Izquierdo - Productos */}
        <div className="products-panel">
          <div className="search-bar">
            <Input
              placeholder="Buscar por Producto, Referencia o Código"
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
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'category-tab--active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {loading ? (
              <div className="loading-message">Cargando productos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-message">No se encontraron productos</div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => addProductToSale(product)}
                >
                  <div className="product-avatar">
                    <span>{product.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category" title={product.description || ''}>
                      {product.description ? product.description.substring(0, 50) + (product.description.length > 50 ? '...' : '') : 'Sin descripción'}
                    </p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    {product.sku && (
                      <p className="product-sku">
                        {product.sku}
                      </p>
                    )}
                    {product.stock > 0 && (
                      <p className="product-stock">Stock: {product.stock}</p>
                    )}
                  </div>
                  {saleItems.some((item) => item.product.id === product.id) && (
                    <div className="product-badge">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 11.5l2 2 4-4m6 .5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="products-footer">
            <p>Mostrando {filteredProducts.length} de {products.length} productos cargados</p>
          </div>
        </div>

        {/* Panel Derecho - Detalle de Venta */}
        <div className="sale-panel">
          <div className="sale-header">
            <div className="sale-doc">
              <h3>Doc. de venta</h3>
              <div className="turn-number">Turno {turnNumber}</div>
            </div>

            <div className="sale-info">
              <div className="info-field">
                <label>Fecha de venta</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>

              <div className="info-field">
                <label>Método de pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                  <option>Mixto</option>
                </select>
              </div>
            </div>

            <div className="client-field">
              <label>Cliente</label>
              <div className="client-input-wrapper">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre del cliente"
                />
                <button className="clear-btn" onClick={() => setClientName('')}>
                  ×
                </button>
                <button className="add-client-btn">+</button>
              </div>
            </div>
          </div>

          <div className="sale-items">
            <h3>Servicio de instalación</h3>
            {saleItems.length === 0 ? (
              <div className="empty-cart">
                <p>No hay productos agregados</p>
              </div>
            ) : (
              saleItems.map((item) => (
                <div key={item.product.id} className="sale-item">
                  <div className="item-header">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <p>Precio unitario: {formatPrice(item.unitPrice)}</p>
                    </div>
                    <div className="item-actions">
                      <button
                        className="icon-btn"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn icon-btn--group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn icon-btn--delete"
                        onClick={() => removeProduct(item.product.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="item-total-section">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        −
                      </button>
                      <span className="quantity">Total: {formatPrice(item.total)}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <div className="quantity-badge">{item.quantity}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sale-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>

            <div className="summary-row discount-row">
              <span>Descuento:</span>
              <div className="discount-input">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                />
                <span>$</span>
              </div>
            </div>

            <div className="summary-row total-row">
              <span>Total:</span>
              <span className="total-amount">{formatPrice(calculateTotal())}</span>
            </div>

            <div className="observations-field">
              <label>Observaciones (opcional)</label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>

            <Button
              variant="success"
              size="large"
              onClick={handleRegisterSale}
              disabled={registering}
              className="register-btn"
            >
              {registering ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="spinner"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <path d="M12 12m-7 0a7 7 0 1 1 14 0"></path>
                  </svg>
                  Registrando...
                </>
              ) : (
                <>Registrar {formatPrice(calculateTotal())}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
