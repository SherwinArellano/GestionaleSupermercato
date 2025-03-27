import { Product } from './product';
import { Supplier } from './supplier';

export interface Stock {
  id: number;
  productId: number;
  supplierId: number;
  quantity: number;
  arrivalDate: Date;
  expiryDate: Date;
}

export interface PStock extends Omit<Stock, 'productId' | 'supplierId'> {
  product: Product;
  supplier: Supplier;
}

export type CreateStockDTO = Omit<Stock, 'id'>;

export type UpdateStockDTO = CreateStockDTO;
