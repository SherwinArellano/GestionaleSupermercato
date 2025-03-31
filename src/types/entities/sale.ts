import { Product } from './product';

export interface Sale {
  id: number;
  totalPrice: number;
  saleDate: Date;
  products: Product[];
  receiptCode: string;
}

export type CreateSaleDTO = Omit<Sale, 'id'>;

export type UpdateSaleDTO = CreateSaleDTO;
