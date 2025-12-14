import './SaleCard.scss';
import type { Sale } from '../../types/sale.types';

interface SaleCardProps {
  sale: Sale;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SaleCard: React.FC<SaleCardProps> = ({
  sale,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { label: 'Completada', class: 'status-badge--completed' };
      case 'pending':
        return { label: 'Pendiente', class: 'status-badge--pending' };
      case 'cancelled':
        return { label: 'Cancelada', class: 'status-badge--cancelled' };
      default:
        return { label: status, class: 'status-badge--default' };
    }
  };

  const statusInfo = getStatusBadge(sale.status);

  return (
    <tr className="sale-card">
      <td className="sale-card__number">
        <span className="badge-number">{sale.saleNumber}</span>
      </td>

      <td className="sale-card__date">{formatDate(sale.saleDate)}</td>

      <td className="sale-card__total">{formatPrice(sale.total)}</td>

      <td className="sale-card__status">
        <span className={`status-badge ${statusInfo.class}`}>
          {statusInfo.label}
        </span>
      </td>

      <td className="sale-card__date-created">{formatDate(sale.createdAt)}</td>

      <td className="sale-card__actions">
        <button
          className="action-btn action-btn--view"
          onClick={() => onView(sale.id)}
          title="Ver"
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
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button
          className="action-btn action-btn--edit"
          onClick={() => onEdit(sale.id)}
          title="Editar"
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
          className="action-btn action-btn--delete"
          onClick={() => onDelete(sale.id)}
          title="Eliminar"
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
      </td>
    </tr>
  );
};
