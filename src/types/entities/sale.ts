export interface SaleProduct {
  id: number; // id of product
  quantity: number;
}

export interface Sale {
  id: number;
  totalPrice: number;
  saleDate: Date;
  products: SaleProduct[];
  receiptCode: string;
}

export type CreateSaleDTO = Omit<Sale, 'id' | 'receiptCode'>;

export type UpdateSaleDTO = CreateSaleDTO;
