import { columns, OverviewProduct } from './products-column';
import { DataTable } from '../../data-table';
import db from '@/lib/db';

export async function ProductsTable() {
  let overviewProducts: OverviewProduct[];

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
  } catch {
    overviewProducts = [];
  }

  return (
    <DataTable label="products" columns={columns} data={overviewProducts} />
  );
}
