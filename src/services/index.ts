export { api } from './api.service';
export { productsService } from './products.service';
export { authService } from './auth.service';
export { salesService } from './sales.service';
export { usersService } from './users.service';

export type { CreateProductDto, UpdateProductDto } from './products.service';
export type { LoginCredentials, LoginResponse, AuthUser, User } from './auth.service';
export type { Sale, SalesResponse, CreateSaleDto, SaleItem } from './sales.service';
