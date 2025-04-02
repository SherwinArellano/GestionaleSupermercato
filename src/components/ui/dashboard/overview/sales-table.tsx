import { columns, OverviewSale } from './sales-columns';
import { DataTable } from '../../data-table';
import { isAxiosError } from 'axios';
import db from '@/lib/db';

export async function SalesTable({ currentPage }: { currentPage: number }) {
  let overviewSales: OverviewSale[];
  let totalPages = 1;
  let isError = false;

  try {
    overviewSales = await db.sales.getSortedByDate();

    totalPages = Math.ceil(overviewSales.length / 20);
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    overviewSales = [];
  }

  return (
    <DataTable
      label="recent sales"
      columns={columns}
      data={overviewSales}
      paginationKey="salePage"
      currentPage={currentPage}
      totalPages={totalPages}
      isError={isError}
    />
  );
}
