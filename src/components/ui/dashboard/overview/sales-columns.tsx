'use client';

import { format } from 'date-fns';
import { ColumnsBuilder } from '../../data-table';
import { currencyFormatter } from '@/lib/utils';
import { Skeleton } from '../../skeleton';
import { Sale } from '@/types/db';

export type OverviewSale = Pick<
  Sale,
  'receiptCode' | 'saleDate' | 'totalPrice'
>;

export type SaleSkeleton = {
  [P in keyof OverviewSale]: number;
};

const [columns, skeletonColumns] = new ColumnsBuilder<
  OverviewSale,
  SaleSkeleton
>()
  .addColumn(
    {
      accessorKey: 'saleDate',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('saleDate'));
        const formatted = format(date, 'P');

        return formatted;
      },
    },
    {
      accessorKey: 'saleDate',
      header: 'Date',
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.saleDate }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'receiptCode',
      header: 'Receipt Code',
    },
    {
      accessorKey: 'receiptCode',
      header: 'Receipt Code',
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.receiptCode }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'totalPrice',
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalPrice'));
        const formatted = currencyFormatter.format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'totalPrice',
      header: () => <div className="text-right">Total Amount</div>,
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.totalPrice }} />
      ),
    }
  )
  .build();

export { columns, skeletonColumns };
