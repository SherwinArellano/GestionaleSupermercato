/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateStockDTO } from '@/types/db';
import { z } from 'zod';

export const StockSchema = z.object({
  quantity: z.coerce
    .number()
    .min(0, 'Quantity is required.')
    .gt(0, { message: 'Please enter a quantity.' })
    .int('Quantity must be an integer.'),
  arrivalDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  productId: z.coerce.number(),
  supplierId: z.coerce.number(),
} satisfies Record<keyof CreateStockDTO, any>);

export type StockValues = z.infer<typeof StockSchema>;
