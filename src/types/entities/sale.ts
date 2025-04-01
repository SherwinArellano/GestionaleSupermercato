export interface Sale {
  id: number;
  totalPrice: number;
  saleDate: Date;
  productsIds: number[];
  receiptCode: string;
}

export type CreateSaleDTO = Omit<Sale, 'id' | 'receiptCode'>;

export type UpdateSaleDTO = CreateSaleDTO;
