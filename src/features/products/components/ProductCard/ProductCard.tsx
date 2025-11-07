import './ProductCard.scss';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-card__avatar">
        {product.avatar ? (
          <img src={product.avatar} alt={product.name} />
        ) : (
          <span className="avatar-initial">{getInitial(product.name)}</span>
        )}
      </div>

      <div className="product-card__name">{product.name}</div>

      <div className="product-card__category">
        <span className="category-badge">{product.category || 'Sin categoría'}</span>
      </div>

      <div className="product-card__price">{formatPrice(product.price)}</div>

      <div className="product-card__status">
        <span className={`status-badge status-badge--${product.status || 'active'}`}>
          {product.status === 'inactive' ? 'Inactivo' : 'Activo'}
        </span>
      </div>

      <div className="product-card__actions">
        <button
          className="action-btn action-btn--view"
          onClick={() => onView(product.id)}
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
          onClick={() => onEdit(product.id)}
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
          onClick={() => onDelete(product.id)}
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
      </div>
    </div>
  );
};
