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
