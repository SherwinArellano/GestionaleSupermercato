/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateSupplierDTO } from '@/types/db';
import { z } from 'zod';

export const SupplierSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  email: z.string().min(1, { message: 'Address is required.' }),
  phoneNumber: z.string().min(1, { message: 'Address is required.' }),
} satisfies Record<keyof CreateSupplierDTO, any>);

export type SupplierValues = z.infer<typeof SupplierSchema>;
