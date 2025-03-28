'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Factory, MoreHorizontal } from 'lucide-react';
import {
  ColumnsBuilder,
  getHeadSortState,
  SortTableHead,
  SortTableHeadSkeleton,
} from '@/components/ui/data-table';
import { PStock } from '@/types/db';
import { deleteStock } from './actions';
import Link from 'next/link';
import { Skeleton } from '../../skeleton';
import { useSession } from 'next-auth/react';
import { checkPermission } from '@/authorization';
import { useActionForm } from '@/hooks/use-form';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type StockSkeleton = Record<keyof PStock, number>;

const [columns, skeletonColumns] = new ColumnsBuilder<PStock, StockSkeleton>()
  .addColumn(
    {
      accessorKey: 'product',
      header: (context) => (
        <SortTableHead
          title="Product"
          value="product"
          desc={getHeadSortState(context)}
        />
      ),
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.original.product.name}</div>
      ),
      filterFn: (row, columnId, filterValue) => {
        return row.original.product.name
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
      sortingFn: (rowA, rowB) => {
        return rowA.original.product.name.localeCompare(
          rowB.original.product.name
        );
      },
    },
    {
      accessorKey: 'product',
      header: () => <SortTableHeadSkeleton title="Product" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.product }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'quantity',
      header: (context) => (
        <SortTableHead
          title="Quantity"
          value="quantity"
          className="-ml-3"
          desc={getHeadSortState(context)}
          number
        />
      ),
      cell: ({ row }) => <div>{row.original.quantity}</div>,
    },
    {
      accessorKey: 'quantity',
      header: () => (
        <SortTableHeadSkeleton title="Quantity" className="-ml-3" number />
      ),
      cell: ({ row }) => (
        <Skeleton className={`h-6`} style={{ width: row.original.quantity }} />
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
      accessorKey: 'supplier',
      header: (context) => (
        <SortTableHead
          title="Supplier"
          value="supplier"
          desc={getHeadSortState(context)}
        />
      ),
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.original.supplier.name}</div>
      ),
      sortingFn: (rowA, rowB) => {
        return rowA.original.supplier.name.localeCompare(
          rowB.original.supplier.name
        );
      },
    },
    {
      accessorKey: 'supplier',
      header: () => <SortTableHeadSkeleton title="Supplier" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.supplier }}
        />
      ),
    }
  )
  .addColumn(
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const stock = row.original;

        return (
          <div className="text-right">
            <StockDropdownMenu stock={stock} />
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        return <Skeleton className="float-right h-8 w-8" />;
      },
    }
  )
  .build();

export { columns, skeletonColumns };

function StockDropdownMenu({ stock }: { stock: PStock }) {
  const { data: session } = useSession();
  const { formAction } = useActionForm({
    action: deleteStock.bind(null, stock.id),
    onSuccess: ({ message }) => {
      toast('Stock deleted', {
        icon: <Factory />,
        description: message,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const copyId = () => {
    navigator.clipboard.writeText(stock.id.toString());
    toast('Copied id', {
      icon: <Copy />,
      description: `Stock id of ${stock.id} has been saved to clipboard.`,
    });
  };

  const canEdit =
    session?.user && checkPermission(session.user.role, 'edit-stock');

  const canDelete =
    session?.user && checkPermission(session.user.role, 'delete-stock');

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyId}>Copy stock ID</DropdownMenuItem>

          {(canEdit || canDelete) && <DropdownMenuSeparator />}

          {canEdit && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/stocks/${stock.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
          )}

          {canDelete && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this stock?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the stock{' '}
            {stock.id}. Do you wish to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">No</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            asChild
          >
            <form action={formAction}>
              <button className="cursor-pointer">Yes, Delete</button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
