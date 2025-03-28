import { DataTableSkeleton } from '../../data-table';
import { StockSkeleton, skeletonColumns } from './columns';

export function StocksTableSkeleton() {
  const data = Array.from(Array(20)).map<StockSkeleton>(() => ({
    id: 40,
    arrivalDate: 90,
    expiryDate: 90,
    product: Math.floor(Math.random() * 110 + 50),
    supplier: Math.floor(Math.random() * 110 + 50),
    quantity: Math.floor(Math.random() * 30 + 40),
  }));

  return (
    <DataTableSkeleton label="stocks" columns={skeletonColumns} data={data} />
  );
}
