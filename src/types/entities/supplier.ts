export interface Supplier {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export type CreateSupplierDTO = Omit<Supplier, 'id'>;

export type UpdateSupplierDTO = CreateSupplierDTO;
