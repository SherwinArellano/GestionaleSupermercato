import { FormError } from '@/types/form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = new Intl.NumberFormat('it', {
  style: 'currency',
  currency: 'EUR',
});

export const formatZodErrors = (error: ZodError): FormError => {
  const errors: FormError = {};
  for (const { path, message } of error.issues || []) {
    errors[path.join('.')] = { message };
  }
  return errors;
};
