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
    const stocksMap = await db.stocks.groupByLatestInfo();
    const salesMap = await db.sales.groupBySaleProducts();

    tableProducts = products.map((product) => {
      const totalStock = stocksMap.get(product.id)?.totalQuantity ?? 0;
      const totalSale = salesMap.get(product.id) ?? 0;
      return {
        quantity: totalStock - totalSale,
        ...product,
      };
    });

    totalPages = Math.ceil(
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ).length / 20
    );
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
