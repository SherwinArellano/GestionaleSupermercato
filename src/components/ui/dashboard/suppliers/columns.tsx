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
  SortTableHead,
  SortTableHeadSkeleton,
} from '@/components/ui/data-table';
import { CreateSupplierDTO, Supplier } from '@/types/db';
import { deleteSupplier } from './actions';
import Link from 'next/link';
import { Skeleton } from '../../skeleton';
import { useSession } from 'next-auth/react';
import { checkPermission } from '@/authorization';
import { useActionForm } from '@/hooks/use-form';
import { toast } from 'sonner';

export type SupplierSkeleton = Record<keyof CreateSupplierDTO, number>;

const [columns, skeletonColumns] = new ColumnsBuilder<
  Supplier,
  SupplierSkeleton
>()
  .addColumn(
    {
      accessorKey: 'name',
      header: () => <SortTableHead title="Name" value="name" />,
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: () => <SortTableHeadSkeleton title="Name" />,
      cell: ({ row }) => (
        <Skeleton className={`ml-3 h-6`} style={{ width: row.original.name }} />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'email',
      header: () => <SortTableHead title="Email" value="email" />,
      cell: ({ row }) => <div className="ml-3">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'email',
      header: () => <SortTableHeadSkeleton title="Email" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.email }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'phoneNumber',
      header: () => <SortTableHead title="Phone Number" value="phoneNumber" />,
      cell: ({ row }) => (
        <div className="ml-3">{row.getValue('phoneNumber')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: () => <SortTableHeadSkeleton title="Phone Number" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.phoneNumber }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'address',
      header: () => <SortTableHead title="Address" value="address" />,
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.getValue('address')}</div>
      ),
    },
    {
      accessorKey: 'address',
      header: () => <SortTableHeadSkeleton title="Address" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.address }}
        />
      ),
    }
  )
  .addColumn(
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const supplier = row.original;

        return (
          <div className="text-right">
            <SupplierDropdownMenu supplier={supplier} />
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

function SupplierDropdownMenu({ supplier }: { supplier: Supplier }) {
  const { data: session } = useSession();
  const { formAction } = useActionForm({
    action: deleteSupplier.bind(null, supplier.id),
    onSuccess: ({ message }) => {
      toast('Supplier deleted', {
        icon: <Factory />,
        description: message,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const copyId = () => {
    navigator.clipboard.writeText(supplier.id.toString());
    toast('Copied id', {
      icon: <Copy />,
      description: `${supplier.name} id has been saved to clipboard.`,
    });
  };

  const canEdit =
    session?.user && checkPermission(session.user.role, 'edit-supplier');

  const canDelete =
    session?.user && checkPermission(session.user.role, 'delete-supplier');

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
          <DropdownMenuItem onClick={copyId}>Copy supplier ID</DropdownMenuItem>

          {(canEdit || canDelete) && <DropdownMenuSeparator />}

          {canEdit && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
                Edit
              </Link>
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
            Are you sure to delete this supplier?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            supplier {supplier.name}. Do you wish to continue?
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
