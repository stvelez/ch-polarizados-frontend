import { api } from './api.service';
import type { Product, ProductsResponse } from '../features/products/types/product.types';

const PRODUCTS_ENDPOINT = '/products';

// DTOs actualizados según schema de Prisma
export interface CreateProductDto {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
  sku?: string | null;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  sku?: string | null;
  isActive?: boolean;
}

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<any>(`${PRODUCTS_ENDPOINT}`);
    
    // Manejar diferentes formatos de respuesta
    let productsArray: Product[] = [];
    
    if (Array.isArray(response.data)) {
      productsArray = response.data;
    } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      productsArray = Array.isArray(response.data.data) ? response.data.data : [];
    } else if (response.data && typeof response.data === 'object' && 'products' in response.data) {
      productsArray = Array.isArray(response.data.products) ? response.data.products : [];
    }
    
    // Normalizar precios (convertir string a number)
    return productsArray.map(p => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    }));
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<any>(`${PRODUCTS_ENDPOINT}/${id}`);
    const product = Array.isArray(response.data) ? response.data[0] : response.data;
    return {
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    };
  },

  create: async (productData: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>(PRODUCTS_ENDPOINT, productData);
    return response.data;
  },

  update: async (id: string, productData: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`${PRODUCTS_ENDPOINT}/${id}`, productData);
    return response.data;
  },

  patch: async (id: string, productData: Partial<UpdateProductDto>): Promise<Product> => {
    const response = await api.patch<Product>(`${PRODUCTS_ENDPOINT}/${id}`, productData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string; success: boolean }> => {
    const response = await api.delete<{ message: string; success: boolean }>(`${PRODUCTS_ENDPOINT}/${id}`);
    return response.data;
  },

  search: async (searchTerm: string): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`${PRODUCTS_ENDPOINT}/search`, {
      params: { q: searchTerm },
    });
    return response.data;
  },

  filterByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`${PRODUCTS_ENDPOINT}/category/${category}`);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean): Promise<Product> => {
    const response = await api.patch<Product>(`${PRODUCTS_ENDPOINT}/${id}/status`, { isActive });
    return response.data;
  },
};

export default productsService;
