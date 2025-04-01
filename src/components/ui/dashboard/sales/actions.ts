'use server';

import { isAuthorized } from '@/lib/authorization';
import db from '@/lib/db';
import { SaleSchema, SaleValues } from '@/lib/entities/sale';
import { formatZodErrors } from '@/lib/utils';
import {
  ExtractRawValues,
  ExtractValues,
  FormState,
  GetEmptyValues,
} from '@/types/form';
import { revalidateTag } from 'next/cache';

const extractRawValues: ExtractRawValues<SaleValues> = (formData) => {
  return {
    saleDate: formData.get('arrivalDate')?.toString(),
    products: formData.get('products')?.toString(),
  };
};

const extractValues: ExtractValues<SaleValues> = (rawData) => {
  const dateNow = new Date();
  return {
    saleDate: rawData.saleDate ? new Date(rawData.saleDate) : dateNow,
    products: JSON.parse(rawData.products ?? '[]'),
  };
};

const getEmptyValues: GetEmptyValues<SaleValues> = () => {
  const dateNow = new Date();
  return {
    saleDate: dateNow,
    products: [],
  };
};

export async function addSale(
  prevState: FormState<SaleValues>,
  formData: FormData
): Promise<FormState<SaleValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = SaleSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to add new sale.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('create-sale');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Create sale
  try {
    const products = values.products;

    const message = await db.sales.create({
      productsIds: products.map(({ id }) => id),
      saleDate: values.saleDate,
      totalPrice: products.reduce(
        (amount, { sellingPrice }) => amount + sellingPrice,
        0
      ),
    });

    revalidateTag('sales');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to create new sale.',
    };
  }
}

// export async function updateSale(
//   id: number,
//   prevState: FormState<SaleValues>,
//   formData: FormData
// ): Promise<FormState<SaleValues>> {
//   // Extract and normalize form values
//   const rawData = extractRawValues(formData);
//   const values = extractValues(rawData);

//   // Validate values
//   const validatedFields = SaleSchema.safeParse(rawData);
//   if (!validatedFields.success) {
//     return {
//       success: false,
//       message: 'Missing or invalid fields. Failed to update sale.',
//       values,
//       errors: formatZodErrors(validatedFields.error),
//     };
//   }

//   // Check if authorized
//   const authorized = await isAuthorized('edit-sale');
//   if (!authorized) {
//     return {
//       values,
//       success: false,
//       message: `You don't have permission to do that.`,
//     };
//   }

//   // Update sale
//   try {
//     const message = await db.sales.updateById(id, validatedFields.data);

//     revalidateTag('sales');

//     return {
//       message,
//       success: true,
//       values: getEmptyValues(),
//     };
//   } catch {
//     return {
//       values,
//       success: false,
//       message: 'Internal server error. Failed to update sale.',
//     };
//   }
// }

// export async function deleteSale(
//   id: number
// ): Promise<Omit<FormState<SaleValues>, 'values' | 'errors'>> {
//   // Check if authorized
//   const authorized = await isAuthorized('delete-sale');
//   if (!authorized) {
//     return {
//       success: false,
//       message: `You don't have permission to do that.`,
//     };
//   }

//   // Delete sale
//   try {
//     const message = await db.sales.deleteById(id);

//     revalidateTag('sales');

//     return {
//       message,
//       success: true,
//     };
//   } catch {
//     return {
//       message: 'Internal server error. Failed to delete sale.',
//       success: false,
//     };
//   }
// }
