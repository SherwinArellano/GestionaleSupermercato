/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateSaleDTO, SaleProduct } from '@/types/db';
import { z } from 'zod';

export const ProductSaleSchema = z.object({
  id: z.coerce.number().gt(0, { message: 'Missing product id.' }),
  quantity: z.coerce
    .number()
    .gt(0, { message: 'Product quantity must be greater than 0.' }),
} satisfies Record<keyof SaleProduct, any>);

export const SaleSchema = z.object({
  saleDate: z.coerce.date({ required_error: 'Sale date is required.' }),
  products: z.array(ProductSaleSchema, {
    message: `Products' quantity must be greater than 0.`,
  }),
  totalPrice: z.coerce.number(),
} satisfies Record<keyof CreateSaleDTO, any>);

export type SaleValues = z.infer<typeof SaleSchema> & {
  products: SaleProduct[];
};
