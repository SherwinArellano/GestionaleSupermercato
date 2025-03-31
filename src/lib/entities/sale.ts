/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateSaleDTO } from '@/types/db';
import { z } from 'zod';

export const SaleSchema = z.object({
  saleDate: z.coerce.date({ required_error: 'Sale date is required.' }),
} satisfies Record<keyof Pick<CreateSaleDTO, 'saleDate'>, any>);

export type SaleValues = z.infer<typeof SaleSchema>;
