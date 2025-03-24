import db from '@/lib/db';
import { columns } from './products-column';
import { Product } from '@/types/db';
import { isAxiosError } from 'axios';
import { DataTable } from '../../data-table';

type ProductsTableProps = {
  search: string;
  currentPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export async function ProductsTable({
  search,
  currentPage,
  order,
  sort,
}: ProductsTableProps) {
  let products: Product[];
  let totalPages = 1;
  let isError = false;

  try {
    const data = await db.products.get();
    products = data.content;

    // Since query functionalities are still limited in the backend
    // then manually get all products:
    const promises: ReturnType<typeof db.products.get>[] = [];
    for (let i = 1; i < data.totalPages; i++)
      promises.push(db.products.get({ page: i }));
    (await Promise.all(promises)).forEach(({ content }) =>
      products.push(...content)
    );

    totalPages = data.totalPages;
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    products = [];
  }

  return (
    <DataTable
      label="products"
      search={search}
      currentPage={currentPage}
      totalPages={totalPages}
      order={order}
      sort={sort}
      columns={columns}
      data={products}
      isError={isError}
    />
  );
}
