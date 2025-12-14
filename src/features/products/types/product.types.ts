// Tipos basados en el schema de Prisma
export interface Product {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number; // Decimal en la BD
  stock: number;
  sku: string | null;
  isActive: boolean;
  createdAt: string; // DateTime
  updatedAt: string; // DateTime
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}
