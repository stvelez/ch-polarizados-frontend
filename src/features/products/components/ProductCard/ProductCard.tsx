import './ProductCard.scss';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
    <tr className="product-card">
      <td className="product-card__name" data-label="Producto">
        <div className="name-container">
          <div className="product-card__avatar">
            <span className="avatar-initial">{getInitial(product.name)}</span>
          </div>
          <div className="name-info">
            <div className="name-text">{product.name}</div>
            {product.description && (
              <div className="name-description">{product.description}</div>
            )}
          </div>
        </div>
      </td>

      <td className="product-card__sku" data-label="SKU">
        <span className="sku-badge">{product.sku || 'Sin SKU'}</span>
      </td>

      <td className="product-card__price" data-label="Precio">
        {formatPrice(product.price)}
      </td>

      <td className="product-card__stock" data-label="Stock">
        <span className={`stock-badge ${product.stock > 0 ? 'stock-badge--available' : 'stock-badge--empty'}`}>
          {product.stock} unidades
        </span>
      </td>

      <td className="product-card__status" data-label="Estado">
        <span className={`status-badge status-badge--${product.isActive ? 'active' : 'inactive'}`}>
          {product.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="product-card__actions" data-label="Acciones">
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
      </td>
    </tr>
  );
};
