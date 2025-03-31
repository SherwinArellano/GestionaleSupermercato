import { DataTableSkeleton } from '../../data-table';
import { ProductSkeleton, skeletonColumns } from './products-column';

export function ProductsTableSkeleton() {
  const data = Array.from(Array(20)).map<ProductSkeleton>(() => ({
    name: Math.floor(Math.random() * 110 + 50),
    category: Math.floor(Math.random() * 110 + 50),
    sellingPrice: Math.floor(Math.random() * 50 + 30),
    quantity: Math.floor(Math.random() * 50 + 30),
  }));

  return (
    <DataTableSkeleton label="products" columns={skeletonColumns} data={data} />
  );
}
