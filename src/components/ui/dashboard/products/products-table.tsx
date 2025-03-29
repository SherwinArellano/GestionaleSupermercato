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
    products = await db.products.getAll();
    totalPages = Math.ceil(products.length / 20);
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
