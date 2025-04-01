import { FormError } from '@/types/form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';
import crypto from 'crypto';

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

const OPERATOR_CODE_LENGTH = 32;
const ALPHANUMERIC =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateCode = () => {
  let result = '';
  for (let i = 0; i < OPERATOR_CODE_LENGTH; i++) {
    const randomIndex = crypto.randomInt(0, ALPHANUMERIC.length);
    result += ALPHANUMERIC[randomIndex];
  }
  return result;
};
