import db from '@/lib/db';
import { columns, TableProduct } from './products-column';
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
  let tableProducts: TableProduct[];
  let totalPages = 1;
  let isError = false;

  try {
    const products = await db.products.getAll();

    // Populate quantities
    const map = await db.stocks.groupByLatestInfo();

    tableProducts = products.map((product) => ({
      quantity: map.get(product.id)?.totalQuantity ?? 0,
      ...product,
    }));

    totalPages = Math.ceil(products.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    tableProducts = [];
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
      data={tableProducts}
      isError={isError}
    />
  );
}
