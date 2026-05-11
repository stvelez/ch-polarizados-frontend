import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components";
import { salesService } from "../../services/sales.service";
import type { Sale } from "../../services/sales.service";
import "./ViewSalePage.scss";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (date?: string) => {
  if (!date) return "No disponible";
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completada",
  cancelled: "Cancelada",
};

export const ViewSalePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSale = useCallback(async () => {
    if (!id) {
      navigate("/sales");
      return;
    }
    try {
      setLoading(true);
      const data = await salesService.getById(id);
      setSale(data);
    } catch (error) {
      console.error("Error al cargar la venta:", error);
      navigate("/sales");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadSale();
  }, [loadSale]);

  if (loading) {
    return (
      <div className="view-sale-page">
        <div className="view-sale-page__content">
          <div className="loading-spinner">Cargando venta...</div>
        </div>
      </div>
    );
  }

  if (!sale) {
    return null;
  }

  const statusLabel = STATUS_LABELS[sale.status] ?? sale.status;
  const saleInitial = sale.saleNumber.charAt(0).toUpperCase();

  return (
    <div className="view-sale-page">
      <div className="view-sale-page__header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate("/sales")}>
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
          <h1 className="header-title">Detalle de Venta</h1>
          <p className="header-subtitle">Información completa de la venta</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/sales/new")}>
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
          Nueva Venta
        </Button>
      </div>

      <div className="view-sale-page__content">
        <div className="sale-detail">
          <div className="detail-header">
            <div className="sale-avatar">
              <span className="avatar-initial">{saleInitial}</span>
            </div>
            <div className="sale-main-info">
              <h2 className="sale-number">{sale.saleNumber}</h2>
              <span className={`status-badge status-badge--${sale.status}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">ID de Venta</label>
                <p className="info-value">#{sale.id}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Número de Venta</label>
                <p className="info-value">{sale.saleNumber}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Total</label>
                <p className="info-value price">{formatCurrency(sale.total)}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Estado</label>
                <p className="info-value">
                  <span className={`status-badge status-badge--${sale.status}`}>
                    {statusLabel}
                  </span>
                </p>
              </div>

              <div className="info-item">
                <label className="info-label">Fecha de Venta</label>
                <p className="info-value">{formatDate(sale.saleDate)}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Fecha de Creación</label>
                <p className="info-value">{formatDate(sale.createdAt)}</p>
              </div>

              {sale.user && (
                <div className="info-item">
                  <label className="info-label">Vendedor</label>
                  <p className="info-value">{sale.user.name} — {sale.user.email}</p>
                </div>
              )}
            </div>
          </div>

          {sale.items && sale.items.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">Productos</h3>
              <div className="items-table-wrapper">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product?.name ?? "—"}</td>
                        <td>
                          <span className="sku-badge">{item.product?.sku ?? "—"}</span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className="subtotal">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="total-label">Total</td>
                      <td className="total-value">{formatCurrency(sale.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
