import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../../services/sales.service';
import { productsService } from '../../services/products.service';
import type { Sale } from '../../services/sales.service';
import type { Product } from '../../features/products/types/product.types';
import './Dashboard.scss';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-CO');

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
};

const STATUS_CLASS: Record<string, string> = {
  completed: 'status--completed',
  pending: 'status--pending',
  cancelled: 'status--cancelled',
};

const LOW_STOCK_THRESHOLD = 5;

export const Dashboard = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [salesRaw, productsData] = await Promise.all([
        salesService.getAll(),
        productsService.getAll(),
      ]);

      // Normalizar respuesta igual que SalesList (el backend puede devolver array, { data: [] } o { sales: [] })
      let salesArray: Sale[] = [];
      if (Array.isArray(salesRaw)) {
        salesArray = salesRaw;
      } else if (salesRaw && typeof salesRaw === 'object' && 'data' in (salesRaw as object)) {
        salesArray = Array.isArray((salesRaw as any).data) ? (salesRaw as any).data : [];
      } else if (salesRaw && typeof salesRaw === 'object' && 'sales' in (salesRaw as object)) {
        salesArray = Array.isArray((salesRaw as any).sales) ? (salesRaw as any).sales : [];
      }

      setSales(salesArray);
      setProducts(productsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Filtrar ventas por periodo seleccionado
  const salesInPeriod = sales.filter((s) => {
    const d = new Date(s.saleDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const salesPrevPeriod = sales.filter((s) => {
    const d = new Date(s.saleDate);
    return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
  });

  // KPI: ingresos de ventas completadas
  const revenue = salesInPeriod
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + Number(s.total), 0);

  const prevRevenue = salesPrevPeriod
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + Number(s.total), 0);

  const revenueChange =
    prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : null;

  // KPI: cantidad de ventas
  const salesCount = salesInPeriod.length;
  const prevSalesCount = salesPrevPeriod.length;
  const salesCountDelta =
    prevSalesCount > 0 ? salesCount - prevSalesCount : null;

  // KPI: productos activos y stock
  const activeProducts = products.filter((p) => p.isActive);
  const lowStockProducts = activeProducts.filter(
    (p) => p.stock < LOW_STOCK_THRESHOLD
  );
  const totalStock = activeProducts.reduce((acc, p) => acc + p.stock, 0);

  // Tabla: últimas 5 ventas del periodo ordenadas por fecha desc
  const recentSales = [...salesInPeriod]
    .sort(
      (a, b) =>
        new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    )
    .slice(0, 5);

  const periodLabel = `${MONTHS_ES[month]} ${year}`;
  const periodSubtitle = isCurrentMonth
    ? `${periodLabel} · Mes actual`
    : periodLabel;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">{periodSubtitle}</p>
        </div>

        <div className="period-selector">
          <button
            className="period-selector__btn"
            onClick={goToPrevMonth}
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <span className="period-selector__label">{periodLabel}</span>
          <button
            className="period-selector__btn"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div className={`dashboard__stats${loading ? ' dashboard__stats--loading' : ''}`}>
        {/* Ventas Totales */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Ventas Totales</p>
            <h3 className="stat-card__value">
              {loading ? '–' : revenue > 0 ? formatCurrency(revenue) : 'Sin ventas'}
            </h3>
            {!loading && revenueChange !== null && (
              <p className={`stat-card__change stat-card__change--${revenueChange >= 0 ? 'up' : 'down'}`}>
                {revenueChange >= 0 ? '+' : ''}
                {revenueChange.toFixed(1)}% vs mes anterior
              </p>
            )}
            {!loading && revenueChange === null && (
              <p className="stat-card__change stat-card__change--neutral">
                Sin datos mes anterior
              </p>
            )}
          </div>
        </div>

        {/* Número de ventas */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Ventas del Mes</p>
            <h3 className="stat-card__value">{loading ? '–' : salesCount}</h3>
            {!loading && salesCountDelta !== null && (
              <p className={`stat-card__change stat-card__change--${salesCountDelta >= 0 ? 'up' : 'down'}`}>
                {salesCountDelta >= 0 ? '+' : ''}
                {salesCountDelta} vs mes anterior
              </p>
            )}
            {!loading && salesCountDelta === null && (
              <p className="stat-card__change stat-card__change--neutral">
                Sin datos mes anterior
              </p>
            )}
          </div>
        </div>

        {/* Productos activos */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Productos Activos</p>
            <h3 className="stat-card__value">
              {loading ? '–' : activeProducts.length}
            </h3>
            {!loading && lowStockProducts.length > 0 && (
              <p className="stat-card__change stat-card__change--down">
                {lowStockProducts.length} con stock bajo
              </p>
            )}
            {!loading && lowStockProducts.length === 0 && (
              <p className="stat-card__change stat-card__change--up">
                Stock saludable
              </p>
            )}
          </div>
        </div>

        {/* Stock Total */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Stock Total</p>
            <h3 className="stat-card__value">
              {loading ? '–' : totalStock.toLocaleString('es-CO')}
            </h3>
            <p className="stat-card__change stat-card__change--neutral">
              unidades en inventario
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard__panels">
        {/* Últimas ventas */}
        <div className="content-card">
          <h2 className="content-card__title">Últimas ventas</h2>
          {loading ? (
            <p className="content-card__empty">Cargando...</p>
          ) : recentSales.length === 0 ? (
            <p className="content-card__empty">Sin ventas en este periodo</p>
          ) : (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="sales-table__number">{sale.saleNumber}</td>
                    <td>{formatDate(sale.saleDate)}</td>
                    <td className="sales-table__total">
                      {formatCurrency(Number(sale.total))}
                    </td>
                    <td>
                      <span className={`status ${STATUS_CLASS[sale.status] ?? ''}`}>
                        {STATUS_LABEL[sale.status] ?? sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alertas de stock */}
        <div className="content-card">
          <h2 className="content-card__title">Alertas de stock</h2>
          {loading ? (
            <p className="content-card__empty">Cargando...</p>
          ) : lowStockProducts.length === 0 ? (
            <div className="stock-ok">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p>Todo el inventario está saludable</p>
            </div>
          ) : (
            <ul className="stock-alert-list">
              {lowStockProducts.slice(0, 8).map((p) => (
                <li key={p.id} className="stock-alert-item">
                  <span className="stock-alert-item__name">{p.name}</span>
                  <span
                    className={`stock-alert-item__qty${p.stock === 0 ? ' stock-alert-item__qty--zero' : ''}`}
                  >
                    {p.stock} uds.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
