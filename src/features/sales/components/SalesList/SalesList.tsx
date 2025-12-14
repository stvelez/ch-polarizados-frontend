import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from '../../../../components';
import { SaleCard } from '../SaleCard/SaleCard';
import { salesService } from '../../../../services/sales.service';
import type { Sale } from '../../types/sale.types';
import './SalesList.scss';
import { useNavigate } from 'react-router-dom';

export const SalesList = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await salesService.getAll();
      
      let salesArray: Sale[] = [];
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response)) {
        salesArray = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        salesArray = Array.isArray((response as any).data) ? (response as any).data : [];
      } else if (response && typeof response === 'object' && 'sales' in response) {
        salesArray = Array.isArray((response as any).sales) ? (response as any).sales : [];
      }
      
      setSales(salesArray);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleView = (id: string) => {
    navigate(`/sales/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/sales/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      try {
        await salesService.delete(id);
        toast.success('Venta eliminada exitosamente');
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
        toast.error('Error al eliminar la venta');
      }
    }
  };

  const handleNewSale = () => {
    navigate('/sales/new');
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'Todos' || sale.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    'Todos',
    'pending',
    'completed',
    'cancelled',
  ];

  return (
    <div className="sales-list">
      <div className="sales-list__header">
        <div className="header-content">
          <h1 className="header-title">Gestión de Ventas</h1>
          <p className="header-subtitle">
            Administra y realiza seguimiento de todas tus ventas
          </p>
        </div>
        <Button variant="primary" onClick={handleNewSale}>
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

      <div className="sales-list__filters">
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
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h3 className="filter-title">Ventas Registradas</h3>
            <p className="filter-count">{filteredSales.length} ventas encontradas</p>
          </div>
        </div>

        <div className="filter-controls">
          <Input
            placeholder="Buscar por número de venta o ID..."
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

          <div className="status-filter">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'Todos' ? 'Todos los estados' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="sales-list__table">
        {loading ? (
          <div className="table-loading">Cargando ventas...</div>
        ) : filteredSales.length === 0 ? (
          <div className="table-empty">No se encontraron ventas</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>DOC. DE VENTA</th>
                <th>FECHA</th>
                <th>TOTAL</th>
                <th>ESTADO</th>
                <th>FECHA DE CREACIÓN</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <SaleCard
                  key={sale.id}
                  sale={sale}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
