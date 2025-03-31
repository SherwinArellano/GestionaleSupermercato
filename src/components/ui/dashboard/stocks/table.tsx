import db from '@/lib/db';
import { Product, PStock } from '@/types/db';
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
    // For now, this is getting all stocks.
    const response = await db.stocks.get();

    // Populate stocks
    const products = await db.products.getAll();
    const deletedProduct: Product = {
      id: -1,
      name: 'Deleted product',
      sellingPrice: 0,
      stocks: [],
      category: {
        id: -1,
        name: 'Unknown',
      },
    };

    stocks = response.data.map(
      ({ arrivalDate, expiryDate, id, quantity, productId, supplier }) => ({
        id,
        arrivalDate,
        expiryDate,
        quantity,
        supplier,
        product: products.find((p) => p.id === productId) ?? deletedProduct,
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
