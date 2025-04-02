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
import { Copy, MoreHorizontal, Receipt } from 'lucide-react';
import {
  ColumnsBuilder,
  getHeadSortState,
  SortTableHead,
  SortTableHeadSkeleton,
} from '@/components/ui/data-table';
import { PSale } from '@/types/db';
import { deleteSale } from './actions';
import Link from 'next/link';
import { Skeleton } from '../../skeleton';
import { useSession } from 'next-auth/react';
import { checkPermission } from '@/authorization';
import { useActionForm } from '@/hooks/use-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { currencyFormatter } from '@/lib/utils';

export type SaleSkeleton = Record<keyof PSale, number>;

const [columns, skeletonColumns] = new ColumnsBuilder<PSale, SaleSkeleton>()
  .addColumn(
    {
      accessorKey: 'saleDate',
      header: (context) => (
        <SortTableHead
          title="Date"
          value="saleDate"
          desc={getHeadSortState(context)}
          number
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('saleDate'));
        const formatted = format(date, 'P');

        return <div className="ml-3">{formatted}</div>;
      },
    },
    {
      accessorKey: 'saleDate',
      header: () => <SortTableHeadSkeleton title="Date" number />,
      cell: ({ row }) => (
        <Skeleton
          className="ml-3 h-5"
          style={{ width: row.original.saleDate }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'totalPrice',
      header: (context) => (
        <SortTableHead
          title="Total Amount"
          value="totalPrice"
          desc={getHeadSortState(context)}
          className="-mr-3 text-right"
          number
        />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalPrice'));
        const formatted = currencyFormatter.format(amount);

        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: 'totalPrice',
      header: () => (
        <SortTableHeadSkeleton title="Total Amount" className="-mr-3" number />
      ),
      cell: ({ row }) => (
        <Skeleton
          className="h-5 text-right"
          style={{ width: row.original.totalPrice }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'receiptCode',
      header: (context) => (
        <SortTableHead
          title="Receipt Code"
          value="receiptCode"
          desc={getHeadSortState(context)}
        />
      ),
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.original.receiptCode}</div>
      ),
    },
    {
      accessorKey: 'receiptCode',
      header: () => <SortTableHeadSkeleton title="Receipt Code" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.receiptCode }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'products',
      header: 'Products',
      cell: ({ row }) => (
        <div className="w-[400px] truncate">
          {row.original.products
            .map(({ name, quantity }) => `${name} x${quantity}`)
            .join(', ')}
        </div>
      ),
    },
    {
      accessorKey: 'products',
      header: 'Products',
      cell: ({ row }) => (
        <Skeleton className={`h-6`} style={{ width: row.original.products }} />
      ),
    }
  )
  .addColumn(
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const sale = row.original;

        return (
          <div className="text-right">
            <SaleDropdownMenu sale={sale} />
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

function SaleDropdownMenu({ sale }: { sale: PSale }) {
  const { data: session } = useSession();
  const { formAction } = useActionForm({
    action: deleteSale.bind(null, sale.id),
    onSuccess: ({ message }) => {
      toast('Sale deleted', {
        icon: <Receipt />,
        description: message,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const copyId = () => {
    navigator.clipboard.writeText(sale.id.toString());
    toast('Copied id', {
      icon: <Copy />,
      description: `Sale id of ${sale.id} has been saved to clipboard.`,
    });
  };

  const canEdit =
    session?.user && checkPermission(session.user.role, 'edit-sale');

  const canDelete =
    session?.user && checkPermission(session.user.role, 'delete-sale');

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
          <DropdownMenuItem onClick={copyId}>Copy sale ID</DropdownMenuItem>

          {(canEdit || canDelete) && <DropdownMenuSeparator />}

          {canEdit && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/sales/${sale.id}/edit`}>Edit</Link>
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
          <AlertDialogTitle>Are you sure to delete this sale?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the sale{' '}
            {sale.id}. Do you wish to continue?
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
