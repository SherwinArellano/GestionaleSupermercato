/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateStockDTO } from '@/types/db';
import { z } from 'zod';

export const StockSchema = z.object({
  quantity: z.coerce
    .number({ required_error: 'Quantity is required.' })
    .gt(0, { message: 'Please enter a quantity.' })
    .int('Quantity must be an integer.'),
  arrivalDate: z.coerce.date({ required_error: 'Arrival date is required.' }),
  expiryDate: z.coerce.date({ required_error: 'Expiry date is required.' }),
  productId: z.coerce.number(),
  supplierId: z.coerce.number(),
} satisfies Record<keyof CreateStockDTO, any>);

export type StockValues = z.infer<typeof StockSchema>;
