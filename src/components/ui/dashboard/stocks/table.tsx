import db from '@/lib/db';
import { PStock } from '@/types/db';
import { isAxiosError } from 'axios';
import { DataTable } from '../../data-table';
import { columns } from './columns';

type StocksTableProps = {
  search: string;
  currentPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export async function StocksTable({
  search,
  currentPage,
  order,
  sort,
}: StocksTableProps) {
  let stocks: PStock[];
  let totalPages = 1;
  let isError = false;

  try {
    // Simulate db request
    await new Promise((resolve) => setTimeout(resolve, 200));

    // For now, this is getting all stocks.
    const response = await db.stocks.get();

    // Populate stocks
    const [products, { data: suppliers }] = await Promise.all([
      db.products.getAll(),
      db.suppliers.get(),
    ]);
    stocks = response.data.map(
      ({ arrivalDate, expiryDate, id, quantity, productId, supplierId }) => ({
        id,
        arrivalDate,
        expiryDate,
        quantity,
        product: products.find((p) => p.id === productId)!,
        supplier: suppliers.find((s) => s.id === supplierId)!,
      })
    );

    totalPages = Math.ceil(stocks.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    stocks = [];
  }

  return (
    <DataTable
      label="stocks"
      search={search}
      searchName="product"
      currentPage={currentPage}
      totalPages={totalPages}
      order={order}
      sort={sort}
      columns={columns}
      data={stocks}
      isError={isError}
    />
  );
}
