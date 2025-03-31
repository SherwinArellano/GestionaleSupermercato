'use client';

import { format } from 'date-fns';
import { ColumnsBuilder } from '../../data-table';
import { PackageOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../tooltip';
import { Skeleton } from '../../skeleton';

const LOW_STOCK_THRESHOLD = 20;
const MEDIUM_STOCK_THRESHOLD = 40;

export type OverviewProduct = {
  name: string;
  arrivalDate: Date;
  expiryDate: Date;
  quantity: number;
};

export type ProductSkeleton = {
  [P in keyof OverviewProduct]: number;
};

const [columns, skeletonColumns] = new ColumnsBuilder<
  OverviewProduct,
  ProductSkeleton
>()
  .addColumn(
    {
      id: 'lowStock',
      header: () => <LowStockTooltip />,
      cell: ({ row }) => {
        const quantity = parseInt(row.getValue('quantity'));

        if (quantity <= LOW_STOCK_THRESHOLD) {
          return (
            <span className="bg-destructive mx-auto block h-2.5 w-2.5 rounded-full" />
          );
        }

        if (quantity <= MEDIUM_STOCK_THRESHOLD) {
          return (
            <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-yellow-500 dark:bg-yellow-600" />
          );
        }

        return null;
      },
    },
    {
      id: 'lowStock',
      header: () => <LowStockTooltip />,
      cell: () => <Skeleton className="mx-auto h-2.5 w-2.5 rounded-full" />,
    }
  )
  .addColumn(
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.name }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'arrivalDate',
      header: 'Arrival Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('arrivalDate'));
        const formatted = format(date, 'P');

        return formatted;
      },
    },
    {
      accessorKey: 'arrivalDate',
      header: 'Arrival Date',
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.arrivalDate }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('expiryDate'));
        const formatted = format(date, 'P');

        return formatted;
      },
    },
    {
      accessorKey: 'expiryDate',
      header: 'Expiry Date',
      cell: ({ row }) => (
        <Skeleton className="h-5" style={{ width: row.original.expiryDate }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'quantity',
      header: () => <div className="text-right">Quantity</div>,
      cell: ({ row }) => {
        return <div className="text-right">{row.getValue('quantity')}</div>;
      },
    },
    {
      accessorKey: 'quantity',
      header: () => <div className="text-right">Quantity</div>,
      cell: ({ row }) => (
        <Skeleton
          className="float-right h-5"
          style={{ width: row.original.quantity }}
        />
      ),
    }
  )
  .build();

export { columns, skeletonColumns };

function LowStockTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <PackageOpen className="mx-auto h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Low stock?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
