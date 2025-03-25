import { DataTableSkeleton } from '../../data-table';
import { SupplierSkeleton, skeletonColumns } from './columns';

export function SuppliersTableSkeleton() {
  const data = Array.from(Array(20)).map<SupplierSkeleton>(() => ({
    name: Math.floor(Math.random() * 110 + 50),
    email: Math.floor(Math.random() * 110 + 50),
    phoneNumber: Math.floor(Math.random() * 110 + 50),
    address: Math.floor(Math.random() * 110 + 50),
  }));

  return (
    <DataTableSkeleton
      label="suppliers"
      columns={skeletonColumns}
      data={data}
    />
  );
}
