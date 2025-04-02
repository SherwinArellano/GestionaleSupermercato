'use client';

import { DataTableSkeleton } from '../../data-table';
import { SaleSkeleton, skeletonColumns } from './sales-columns';

export function SalesTableSkeleton() {
  const data = Array.from(Array(10)).map<SaleSkeleton>(() => ({
    receiptCode: 70,
    saleDate: 70,
    totalPrice: Math.floor(Math.random() * 25 + 40),
  }));

  return (
    <DataTableSkeleton
      label="recent sales"
      columns={skeletonColumns}
      data={data}
    />
  );
}
