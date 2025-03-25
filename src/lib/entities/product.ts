/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateProductDTO } from '@/types/db';
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  sellingPrice: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than €0.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
} satisfies Record<keyof CreateProductDTO, any>);

export type ProductValues = z.infer<typeof ProductSchema>;
