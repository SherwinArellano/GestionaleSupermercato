import { DataTableSkeleton } from '../../data-table';
import { SaleSkeleton, skeletonColumns } from './columns';

export function SalesTableSkeleton() {
  const data = Array.from(Array(20)).map<SaleSkeleton>(() => ({
    id: 40,
    saleDate: 90,
    receiptCode: 120,
    products: Math.floor(Math.random() * 110 + 50),
    totalPrice: Math.floor(Math.random() * 40 + 30),
  }));

  return (
    <DataTableSkeleton label="sales" columns={skeletonColumns} data={data} />
  );
}
