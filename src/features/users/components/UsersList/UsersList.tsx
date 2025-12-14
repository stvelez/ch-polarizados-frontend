import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from '../../../../components';
import { UserCard } from '../UserCard/UserCard';
import { usersService } from '../../../../services/users.service';
import type { User } from '../../types/user.types';
import './UsersList.scss';
import { useNavigate } from 'react-router-dom';

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll();
      
      // Asegurarse de que response sea un array o extraer los datos correctos
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && typeof response === 'object' && 'data' in response) {
        const dataArray = (response as any).data;
        setUsers(Array.isArray(dataArray) ? dataArray : []);
      } else {
        console.error('Response is not an array or expected object:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (id: string) => {
    navigate(`/users/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await usersService.delete(id);
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await usersService.toggleActive(id);
      toast.success('Estado del usuario actualizado');
      fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const handleAddUser = () => {
    navigate('/users/add');
  };

  const filteredUsers = Array.isArray(users) 
    ? users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      })
    : [];

  return (
    <div className="users-list">
      <div className="users-list__header">
        <div className="header-content">
          <h1 className="header-title">Gestión de Usuarios</h1>
          <p className="header-subtitle">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button variant="primary" onClick={handleAddUser}>
          + Agregar Usuario
        </Button>
      </div>

      <div className="users-list__filters">
        <div className="search-container">
          <Input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-list__content">
        {loading ? (
          <div className="loading-state">
            <p>Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha de Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
