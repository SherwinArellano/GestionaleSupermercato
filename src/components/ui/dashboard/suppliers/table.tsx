import db from '@/lib/db';
import { columns } from './columns';
import { Supplier } from '@/types/db';
import { isAxiosError } from 'axios';
import { DataTable } from '../../data-table';

type SuppliersTableProps = {
  search: string;
  currentPage: number;
  order: 'asc' | 'desc';
  sort: string;
};

export async function SuppliersTable({
  search,
  currentPage,
  order,
  sort,
}: SuppliersTableProps) {
  let suppliers: Supplier[];
  let totalPages = 1;
  let isError = false;

  try {
    // For now, this is getting all suppliers.
    const response = await db.suppliers.get();
    suppliers = response.data;
    totalPages = Math.ceil(suppliers.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    suppliers = [];
  }

  return (
    <DataTable
      label="suppliers"
      search={search}
      currentPage={currentPage}
      totalPages={totalPages}
      order={order}
      sort={sort}
      columns={columns}
      data={suppliers}
      isError={isError}
    />
  );
}
