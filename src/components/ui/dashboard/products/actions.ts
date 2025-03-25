'use server';

import { isAuthorized } from '@/lib/authorization';
import db from '@/lib/db';
import { ProductSchema, ProductValues } from '@/lib/entities/product';
import { formatZodErrors } from '@/lib/utils';
import {
  ExtractRawValues,
  ExtractValues,
  FormState,
  GetEmptyValues,
} from '@/types/form';
import { revalidateTag } from 'next/cache';

const extractRawValues: ExtractRawValues<ProductValues> = (formData) => {
  return {
    name: formData.get('name')?.toString(),
    sellingPrice: formData.get('sellingPrice')?.toString(),
    category: formData.get('category')?.toString(),
  };
};

const extractValues: ExtractValues<ProductValues> = (rawData) => {
  return {
    name: rawData.name ?? '',
    category: rawData.category ?? '',
    sellingPrice: parseFloat(rawData.sellingPrice ?? '') || 0,
  };
};

const getProductEmptyValues: GetEmptyValues<ProductValues> = () => {
  return {
    name: '',
    category: '',
    sellingPrice: 0,
  };
};

export async function addProduct(
  prevState: FormState<ProductValues>,
  formData: FormData
): Promise<FormState<ProductValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = ProductSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to add new product.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('create-product');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Create product
  try {
    const { name, sellingPrice, category } = validatedFields.data;
    const sellingPriceInCents = sellingPrice * 100;

    const message = await db.products.create({
      name,
      sellingPrice: sellingPriceInCents,
      category: { name: category },
    });

    revalidateTag('products');

    return {
      message,
      success: true,
      values: getProductEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to create new product.',
    };
  }
}

export async function updateProduct(
  id: number,
  prevState: FormState<ProductValues>,
  formData: FormData
): Promise<FormState<ProductValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = ProductSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to update product.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('edit-product');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Update product
  try {
    const { name, sellingPrice, category } = validatedFields.data;
    const sellingPriceInCents = sellingPrice * 100;

    const message = await db.products.update(id, {
      name,
      sellingPrice: sellingPriceInCents,
      category: { name: category },
    });

    revalidateTag('products');

    return {
      message,
      success: true,
      values: getProductEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to update product.',
    };
  }
}

export async function deleteProduct(
  id: number
): Promise<Omit<FormState<ProductValues>, 'values' | 'errors'>> {
  // Check if authorized
  const authorized = await isAuthorized('delete-product');
  if (!authorized) {
    return {
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Delete product
  try {
    const message = await db.products.deleteById(id);

    revalidateTag('products');

    return {
      message,
      success: true,
    };
  } catch {
    return {
      message: 'Internal server error. Failed to delete product.',
      success: false,
    };
  }
}
