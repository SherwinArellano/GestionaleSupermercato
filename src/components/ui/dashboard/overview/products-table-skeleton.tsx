'use client';

import { DataTableSkeleton } from '../../data-table';
import { ProductSkeleton, skeletonColumns } from './products-column';

export function ProductsTableSkeleton() {
  const data = Array.from(Array(10)).map<ProductSkeleton>(() => ({
    name: Math.floor(Math.random() * 20 + 70),
    arrivalDate: 70,
    expiryDate: 70,
    quantity: Math.floor(Math.random() * 30 + 20),
  }));

  return (
    <DataTableSkeleton label="products" columns={skeletonColumns} data={data} />
  );
}
