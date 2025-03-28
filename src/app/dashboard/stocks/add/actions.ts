'use server';

import { ComboboxItem } from '@/components/ui/combobox';
import db from '@/lib/db';

export const suppliersAction = async (
  state: ComboboxItem[],
  formData: FormData
): Promise<ComboboxItem[]> => {
  const input = formData.get('input')?.toString() ?? '';
  const suppliers = await db.suppliers.getManyByName(input, {
    limit: 10,
  });

  return suppliers.map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }));
};

export const productsAction = async (
  state: ComboboxItem[],
  formData: FormData
): Promise<ComboboxItem[]> => {
  const input = formData.get('input')?.toString() ?? '';
  const products = await db.products.getManyByName(input, {
    limit: 10,
  });

  return products.map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }));
};
