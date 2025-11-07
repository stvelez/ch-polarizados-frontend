import { api } from './api.service';
import type { Product, ProductsResponse } from '../features/products/types/product.types';

const PRODUCTS_ENDPOINT = '/products';

export interface CreateProductDto {
    id?: number;
  name: string;
  category: string;
  price: number;
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  price?: number;
  status?: 'active' | 'inactive';
  avatar?: string;
}

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>(PRODUCTS_ENDPOINT);
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (productData: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>(PRODUCTS_ENDPOINT, productData);
    return response.data;
  },

  update: async (id: number, productData: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`${PRODUCTS_ENDPOINT}/${id}`, productData);
    return response.data;
  },

  patch: async (id: number, productData: Partial<UpdateProductDto>): Promise<Product> => {
    const response = await api.patch<Product>(`${PRODUCTS_ENDPOINT}/${id}`, productData);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string; success: boolean }> => {
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

  updateStatus: async (id: number, status: 'active' | 'inactive'): Promise<Product> => {
    const response = await api.patch<Product>(`${PRODUCTS_ENDPOINT}/${id}/status`, { status });
    return response.data;
  },
};

export default productsService;
