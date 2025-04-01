'use server';

import { ProductActionItem } from '@/components/ui/dashboard/sales/add-form';
import db from '@/lib/db';

export const productsAction = async (
  state: ProductActionItem[],
  formData: FormData
): Promise<ProductActionItem[]> => {
  const input = formData.get('input')?.toString() ?? '';
  const products = await db.products.getManyByName(input, {
    limit: 10,
  });

  return products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
    product,
  }));
};
