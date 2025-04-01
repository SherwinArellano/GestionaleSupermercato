import { Product } from './product';

export interface SaleProduct {
  id: number; // id of product
  quantity: number;
}

export type PSaleProduct = Omit<SaleProduct, 'id'> & Product;

export interface Sale {
  id: number;
  totalPrice: number;
  saleDate: Date;
  products: SaleProduct[];
  receiptCode: string;
}

export type CreateSaleDTO = Omit<Sale, 'id' | 'receiptCode'>;

export type UpdateSaleDTO = Omit<Sale, 'id'>;

export type PSale = Omit<Sale, 'products'> & { products: PSaleProduct[] };
