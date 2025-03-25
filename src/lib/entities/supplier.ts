/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateSupplierDTO } from '@/types/db';
import { z } from 'zod';

// Phone Regex: https://stackoverflow.com/a/16699507/12294437
const PHONE_NUMBER_REGEX =
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const SupplierSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  email: z
    .string()
    .email('Invalid email. E.g. mail@example.com')
    .min(1, { message: 'Email is required.' }),
  phoneNumber: z
    .string()
    .min(1, { message: 'Phone number is required.' })
    .refine(
      (value) => PHONE_NUMBER_REGEX.test(value),
      (value) => ({
        message:
          value === ''
            ? 'Phone number is required.'
            : 'Invalid phone number. E.g. +39 321 456 7890',
      })
    ),
} satisfies Record<keyof CreateSupplierDTO, any>);

export type SupplierValues = z.infer<typeof SupplierSchema>;
