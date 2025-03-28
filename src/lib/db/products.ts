import { Product, CreateProductDTO, UpdateProductDTO } from '@/types/db';
import instance from './instance';
import { AxiosResponse } from 'axios';

const route = `products`;

export const get = async ({
  page,
  sortDirection,
  dataType,
}: {
  page?: number;
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
  params.set('sortDirection', sortDirection ?? 'asc');
  params.set('dataType', (dataType as string | undefined) || 'name');

  const response = await instance.get(`/${route}/?${params.toString()}`);

  return response.data;
};

export const getById = async (id: number): Promise<Product> => {
  const response = await instance.get<Product>(`/${route}/id/?id=${id}`);
  return response.data;
};

export const getManyByName = async (
  name: string,
  options?: { limit?: number }
): Promise<Product[]> => {
  let products: Product[];

  try {
    const data = await get();
    products = data.content;

    // Since query functionalities are still limited in the backend
    // then manually get all products:
    const promises: ReturnType<typeof get>[] = [];
    for (let i = 1; i < data.totalPages; i++) promises.push(get({ page: i }));
    (await Promise.all(promises)).forEach(({ content }) =>
      products.push(...content)
    );
  } catch {
    products = [];
  }

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  if (options?.limit) {
    const limit =
      options.limit > products.length ? products.length : options.limit;
    filtered.splice(limit);
  }

  return filtered;
};

export const create = async (data: CreateProductDTO): Promise<string> => {
  const response = await instance.post<
    string,
    AxiosResponse,
    CreateProductDTO & Pick<Product, 'stocks'>
  >(`/${route}/add`, { ...data, stocks: [] });
  return response.data;
};

export const update = async (
  id: number,
  data: UpdateProductDTO
): Promise<string> => {
  const response = await instance.put<string, AxiosResponse, UpdateProductDTO>(
    `/${route}/id/?id=${id}`,
    data
  );
  return response.data;
};

export const deleteById = async (id: number): Promise<string> => {
  const response = await instance.delete<string>(`/${route}/id/?id=${id}`);
  return response.data;
};
