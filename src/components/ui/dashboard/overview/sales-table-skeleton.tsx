'use client';

import { DataTableSkeleton } from '../../data-table';
import { SaleSkeleton, skeletonColumns } from './sales-columns';

export function SalesTableSkeleton() {
  const data = Array.from(Array(10)).map<SaleSkeleton>(() => ({
    id: 50,
    date: 70,
    amount: Math.floor(Math.random() * 25 + 40),
  }));

  return (
    <DataTableSkeleton
      label="recent sales"
      columns={skeletonColumns}
      data={data}
    />
  );
}
