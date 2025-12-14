import './UserCard.scss';
import type { User } from '../../types/user.types';

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getRoleBadgeClass = (role: string) => {
    return role === 'admin' ? 'role-badge--admin' : 'role-badge--user';
  };

  return (
    <tr className="user-card">
      <td className="user-card__name">
        <div className="name-container">
          <div className="user-card__avatar">
            <span className="avatar-initial">{getInitial(user.name)}</span>
          </div>
          <div className="name-info">
            <div className="name-text">{user.name}</div>
            <div className="name-email">{user.email}</div>
          </div>
        </div>
      </td>

      <td className="user-card__role">
        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
          {user.role}
        </span>
      </td>

      <td className="user-card__status">
        <span className={`status-badge ${user.isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="user-card__date">{formatDate(user.createdAt)}</td>

      <td className="user-card__actions">
        <div className="actions-container">
          <button
            className="action-btn action-btn--toggle"
            onClick={() => onToggleActive(user.id)}
            title={user.isActive ? 'Desactivar' : 'Activar'}
          >
            {user.isActive ? '🔒' : '🔓'}
          </button>
          <button
            className="action-btn action-btn--edit"
            onClick={() => onEdit(user.id)}
            title="Editar"
          >
            ✏️
          </button>
          <button
            className="action-btn action-btn--delete"
            onClick={() => onDelete(user.id)}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};
