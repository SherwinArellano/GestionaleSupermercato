'use server';

import { isAuthorized } from '@/lib/authorization';
import db from '@/lib/db';
import { StockSchema, StockValues } from '@/lib/entities/stock';
import { formatZodErrors } from '@/lib/utils';
import {
  ExtractRawValues,
  ExtractValues,
  FormState,
  GetEmptyValues,
} from '@/types/form';
import { revalidateTag } from 'next/cache';

const extractRawValues: ExtractRawValues<StockValues> = (formData) => {
  return {
    arrivalDate: formData.get('arrivalDate')?.toString(),
    expiryDate: formData.get('expiryDate')?.toString(),
    productId: formData.get('productId')?.toString(),
    supplierId: formData.get('supplierId')?.toString(),
    quantity: formData.get('quantity')?.toString(),
  };
};

const extractValues: ExtractValues<StockValues> = (rawData) => {
  const dateNow = new Date();
  return {
    arrivalDate: rawData.arrivalDate ? new Date(rawData.arrivalDate) : dateNow,
    expiryDate: rawData.expiryDate ? new Date(rawData.expiryDate) : dateNow,
    productId: Number(rawData.productId) || 0,
    supplierId: Number(rawData.supplierId) || 0,
    quantity: Number(rawData.quantity) || 0,
  };
};

const getEmptyValues: GetEmptyValues<StockValues> = () => {
  const dateNow = new Date();
  return {
    arrivalDate: dateNow,
    expiryDate: dateNow,
    productId: 0,
    supplierId: 0,
    quantity: 0,
  };
};

export async function addStock(
  prevState: FormState<StockValues>,
  formData: FormData
): Promise<FormState<StockValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = StockSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to add new stock.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('create-stock');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Create stock
  try {
    const message = await db.stocks.create(validatedFields.data);

    revalidateTag('stocks');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to create new stock.',
    };
  }
}

export async function updateStock(
  id: number,
  prevState: FormState<StockValues>,
  formData: FormData
): Promise<FormState<StockValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = StockSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to update stock.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('edit-stock');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Update stock
  try {
    const message = await db.stocks.updateById(id, validatedFields.data);

    revalidateTag('stocks');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to update stock.',
    };
  }
}

export async function deleteStock(
  id: number
): Promise<Omit<FormState<StockValues>, 'values' | 'errors'>> {
  // Check if authorized
  const authorized = await isAuthorized('delete-stock');
  if (!authorized) {
    return {
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Delete stock
  try {
    const message = await db.stocks.deleteById(id);

    revalidateTag('stocks');

    return {
      message,
      success: true,
    };
  } catch {
    return {
      message: 'Internal server error. Failed to delete stock.',
      success: false,
    };
  }
}
