import { columns, OverviewProduct } from './products-column';
import { DataTable } from '../../data-table';
import db from '@/lib/db';
import { isAxiosError } from 'axios';

export async function ProductsTable({ currentPage }: { currentPage: number }) {
  let overviewProducts: OverviewProduct[];
  let totalPages = 1;
  let isError = false;

  try {
    const products = await db.products.getAll();
    const map = await db.stocks.groupByLatestInfo();

    const fallbackDate = new Date(0);
    overviewProducts = products
      .map<OverviewProduct>(({ id, name }) => {
        const info = map.get(id);
        return {
          name,
          arrivalDate: info?.latestArrivalDate ?? fallbackDate,
          expiryDate: info?.latestExpiryDate ?? fallbackDate,
          quantity: info?.totalQuantity ?? 0,
        };
      })
      .sort((a, b) => a.quantity - b.quantity);

    totalPages = Math.ceil(products.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    overviewProducts = [];
  }

  return (
    <DataTable
      label="products"
      columns={columns}
      data={overviewProducts}
      paginationKey="productPage"
      currentPage={currentPage}
      totalPages={totalPages}
      isError={isError}
    />
  );
}
