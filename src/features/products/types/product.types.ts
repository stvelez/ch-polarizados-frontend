export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  createdAt?: string;
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}
