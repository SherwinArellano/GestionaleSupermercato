'use server';

import db from '@/lib/db';
import { ProductSchema, ProductValues } from '@/lib/entities/product';
import { RawFormData } from '@/types/utils';
import { revalidateTag } from 'next/cache';
import { ZodError } from 'zod';

type FormError = Record<string, { message: string }>;

export type ProductFormState = {
  message: string;
  values: ProductValues;
  errors?: FormError;
  success: boolean;
};

function getRawProductFormData(formData: FormData): RawFormData<ProductValues> {
  return {
    name: formData.get('name'),
    sellingPrice: formData.get('sellingPrice'),
    category: formData.get('category'),
  } as RawFormData<ProductValues>;
}

function parseFormErrors(error: ZodError): FormError {
  const errors: FormError = {};
  for (const { path, message } of error.issues || []) {
    errors[path.join('.')] = { message };
  }
  return errors;
}

function buildProductFormErrorObject(
  message: string,
  rawFormData: RawFormData<ProductValues>,
  error: ZodError
) {
  return {
    errors: parseFormErrors(error),
    success: false,
    message,
    values: {
      name: rawFormData.name ?? '',
      category: rawFormData.category ?? '',
      sellingPrice: parseFloat(rawFormData.sellingPrice ?? ''),
    },
  };
}

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawFormData = getRawProductFormData(formData);
  const validatedFields = ProductSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return buildProductFormErrorObject(
      'Missing or invalid fields. Failed to create new product.',
      rawFormData,
      validatedFields.error
    );
  }

  const { name, sellingPrice, category } = validatedFields.data;
  const sellingPriceInCents = sellingPrice * 100;

  let message: string;
  let success = false;
  try {
    message = await db.products.create({
      name,
      sellingPrice: sellingPriceInCents,
      category: { name: category },
    });
    success = true;
  } catch {
    message = 'Internal server error. Failed to create new product.';
  }

  revalidateTag('products');

  return {
    success,
    message,
    values: { name: '', sellingPrice: 0, category: '' },
  };
}

export async function updateProduct(
  id: number,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawFormData = getRawProductFormData(formData);
  const validatedFields = ProductSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return buildProductFormErrorObject(
      'Missing or invalid fields. Failed to update product.',
      rawFormData,
      validatedFields.error
    );
  }

  const { name, sellingPrice, category } = validatedFields.data;
  const sellingPriceInCents = sellingPrice * 100;

  let message: string;
  let success = false;
  try {
    message = await db.products.update(id, {
      name,
      sellingPrice: sellingPriceInCents,
      category: { name: category },
    });
    success = true;
    revalidateTag('products');
  } catch {
    message = `Internal server error. Failed to update product.`;
  }

  return {
    success,
    message,
    values: { name: '', sellingPrice: 0, category: '' },
  };
}

export async function deleteProduct(
  id: number
): Promise<Omit<ProductFormState, 'values' | 'errors'>> {
  let message: string;
  let success = false;

  try {
    message = await db.products.deleteById(id);
    success = true;
  } catch {
    message = 'Internal server error. Failed to delete product.';
  }

  revalidateTag('products');

  return {
    message,
    success,
  };
}
