import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components";
import type { Product } from "../../features/products/types/product.types";
import "./ViewProductPage.scss";
import { productsService } from "../../services";

export const ViewProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/products");
        return;
      }

      try {
        setLoading(true);
        const productData = await productsService.getById(Number(id));
        setProduct(productData);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/products");
  };

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date?: string) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="view-product-page">
        <div className="view-product-page__content">
          <div className="loading-spinner">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="view-product-page">
      <div className="view-product-page__header">
        <div className="header-content">
          <button className="back-button" onClick={handleBack}>
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
          <h1 className="header-title">Detalle del Producto</h1>
          <p className="header-subtitle">Información completa del producto</p>
        </div>
        <Button variant="primary" onClick={handleEdit}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar Producto
        </Button>
      </div>

      <div className="view-product-page__content">
        <div className="product-detail">
          <div className="detail-header">
            <div className="product-avatar">
              {product.avatar ? (
                <img src={product.avatar} alt={product.name} />
              ) : (
                <span className="avatar-initial">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="product-main-info">
              <h2 className="product-name">{product.name}</h2>
              <span
                className={`status-badge status-badge--${
                  product.status || "active"
                }`}
              >
                {product.status === "inactive" ? "Inactivo" : "Activo"}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">ID del Producto</label>
                <p className="info-value">#{product.id}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Nombre</label>
                <p className="info-value">{product.name}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Categoría</label>
                <p className="info-value">
                  <span className="category-badge">
                    {product.category || "Sin categoría"}
                  </span>
                </p>
              </div>

              <div className="info-item">
                <label className="info-label">Precio</label>
                <p className="info-value price">{formatPrice(product.price)}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Estado</label>
                <p className="info-value">
                  <span
                    className={`status-badge status-badge--${
                      product.status || "active"
                    }`}
                  >
                    {product.status === "inactive" ? "Inactivo" : "Activo"}
                  </span>
                </p>
              </div>

              <div className="info-item">
                <label className="info-label">Fecha de Creación</label>
                <p className="info-value">{formatDate(product.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
