import { api } from './api.service';

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateSaleDto {
  clientName: string;
  saleDate: string;
  paymentMethod: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  observations?: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  userId: string;
  total: number;
  status: string;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
}

const SALES_ENDPOINT = '/sales';

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get<any>(`${SALES_ENDPOINT}`);
    
    return response.data;
  },

  getById: async (id: string): Promise<Sale> => {
    const response = await api.get<any>(`${SALES_ENDPOINT}/${id}`);
    const sale = Array.isArray(response.data) ? response.data[0] : response.data;
    return sale;
  },

  create: async (saleData: CreateSaleDto): Promise<Sale> => {
    const response = await api.post<any>(`${SALES_ENDPOINT}`, saleData);
    
    // Manejar diferentes formatos de respuesta
    let sale: Sale;
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      sale = (response.data as any).data;
    } else if (Array.isArray(response.data)) {
      sale = response.data[0];
    } else {
      sale = response.data;
    }
    
    return sale;
  },

  update: async (id: string, saleData: Partial<Sale>): Promise<Sale> => {
    const response = await api.put<Sale>(`${SALES_ENDPOINT}/${id}`, saleData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string; success: boolean }> => {
    const response = await api.delete<{ message: string; success: boolean }>(`${SALES_ENDPOINT}/${id}`);
    return response.data;
  },

  search: async (searchTerm: string): Promise<SalesResponse> => {
    const response = await api.get<SalesResponse>(`${SALES_ENDPOINT}/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Sale> => {
    const response = await api.patch<Sale>(`${SALES_ENDPOINT}/${id}/status`, { status });
    return response.data;
  },
};

export default salesService;
