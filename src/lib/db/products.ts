'use server';

import { Product, CreateProductDTO, UpdateProductDTO } from '@/types/db';
import instance, {
  createCacheId,
  createInvalidateUpdateCache,
} from './instance';

const route = `products`;

export const get = async ({
  page,
  name,
  sortDirection,
  dataType,
}: {
  page?: number;
  name?: string;
  sortDirection?: 'asc' | 'desc';
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  dataType?: keyof Pick<Product, 'name' | 'sellingPrice' | 'category'> | {};
} = {}): Promise<{
  content: Product[];
  last: boolean;
  first: boolean;
  totalElements: number;
  totalPages: number;
  size: number; // max items in a page
  number: number; // current page
  numberOfElements: number; // returned items
}> => {
  const params = new URLSearchParams();

  params.set('page', page?.toString() || '0');
  if (name) params.set('name', name);
  params.set('sortDirection', sortDirection ?? 'asc');
  params.set('dataType', (dataType as string | undefined) || 'name');

  const response = await instance.get(`/${route}/?${params.toString()}`, {
    id: createCacheId(['products', params.toString()]),
  });
  return structuredClone(response.data);
};

export const getById = async (id: number): Promise<Product> => {
  const response = await instance.get<Product>(`/${route}/id/?id=${id}`, {
    id: createCacheId(['product', id]),
  });
  return response.data;
};

export const create = async (data: CreateProductDTO): Promise<string> => {
  const response = await instance.post<
    string,
    CreateProductDTO & Pick<Product, 'stocks'>
  >(
    `/${route}/add`,
    { ...data, stocks: [] },
    {
      cache: {
        update: await createInvalidateUpdateCache(['products']),
      },
    }
  );
  return response.data;
};

export const update = async (
  id: number,
  data: UpdateProductDTO
): Promise<string> => {
  const response = await instance.put<string, UpdateProductDTO>(
    `/${route}/id/?id=${id}`,
    data,
    {
      cache: {
        update: await createInvalidateUpdateCache(
          ['products'],
          ['product', id]
        ),
      },
    }
  );
  return response.data;
};

export const deleteById = async (id: number): Promise<string> => {
  const response = await instance.delete<string>(`/${route}/id/?id=${id}`, {
    cache: {
      update: await createInvalidateUpdateCache(['products'], ['product', id]),
    },
  });
  return response.data;
};
