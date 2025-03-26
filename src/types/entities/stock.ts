export interface Stock {
  id: number;
  productId: number;
  supplierId: number;
  quantity: number;
  arrivalDate: Date;
  expiryDate: Date;
}

export type CreateStockDTO = Omit<Stock, 'id'>;

export type UpdateStockDTO = CreateStockDTO;
