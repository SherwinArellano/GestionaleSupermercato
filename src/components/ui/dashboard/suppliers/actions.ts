'use server';

import { isAuthorized } from '@/lib/authorization';
import db from '@/lib/db';
import { SupplierSchema, SupplierValues } from '@/lib/entities/supplier';
import { formatZodErrors } from '@/lib/utils';
import {
  ExtractRawValues,
  ExtractValues,
  FormState,
  GetEmptyValues,
} from '@/types/form';
import { revalidateTag } from 'next/cache';

const extractRawValues: ExtractRawValues<SupplierValues> = (formData) => {
  return {
    name: formData.get('name')?.toString(),
    address: formData.get('address')?.toString(),
    email: formData.get('email')?.toString(),
    phoneNumber: formData.get('phoneNumber')?.toString(),
  };
};

const extractValues: ExtractValues<SupplierValues> = (rawData) => {
  return {
    name: rawData.name ?? '',
    address: rawData.address ?? '',
    email: rawData.email ?? '',
    phoneNumber: rawData.phoneNumber ?? '',
  };
};

const getEmptyValues: GetEmptyValues<SupplierValues> = () => {
  return {
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
  };
};

export async function addSupplier(
  prevState: FormState<SupplierValues>,
  formData: FormData
): Promise<FormState<SupplierValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = SupplierSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to add new supplier.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('create-supplier');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Create supplier
  try {
    const message = await db.suppliers.create(validatedFields.data);

    revalidateTag('suppliers');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to create new supplier.',
    };
  }
}

export async function updateSupplier(
  id: number,
  prevState: FormState<SupplierValues>,
  formData: FormData
): Promise<FormState<SupplierValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = SupplierSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to update supplier.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('edit-supplier');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Update supplier
  try {
    const message = await db.suppliers.updateById(id, validatedFields.data);

    revalidateTag('suppliers');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to update supplier.',
    };
  }
}

export async function deleteSupplier(
  id: number
): Promise<Omit<FormState<SupplierValues>, 'values' | 'errors'>> {
  // Check if authorized
  const authorized = await isAuthorized('delete-supplier');
  if (!authorized) {
    return {
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Delete supplier
  try {
    const message = await db.suppliers.deleteById(id);

    revalidateTag('suppliers');

    return {
      message,
      success: true,
    };
  } catch {
    return {
      message: 'Internal server error. Failed to delete supplier.',
      success: false,
    };
  }
}
