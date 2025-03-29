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
import * as lucide from 'lucide-react';
import {
  ColumnsBuilder,
  getHeadSortState,
  SortTableHead,
  SortTableHeadSkeleton,
} from '@/components/ui/data-table';
import { CreateUserDTO, User } from '@/types/db';
import { deleteUser } from './actions';
import Link from 'next/link';
import { Skeleton } from '../../skeleton';
import { useSession } from 'next-auth/react';
import { checkPermission } from '@/authorization';
import { useActionForm } from '@/hooks/use-form';
import { toast } from 'sonner';

export type UserSkeleton = Record<keyof CreateUserDTO, number>;

const [columns, skeletonColumns] = new ColumnsBuilder<User, UserSkeleton>()
  .addColumn(
    {
      accessorKey: 'name',
      header: (context) => (
        <SortTableHead
          title="Name"
          value="name"
          desc={getHeadSortState(context)}
        />
      ),
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
      accessorKey: 'surname',
      header: (context) => (
        <SortTableHead
          title="Surname"
          value="surname"
          desc={getHeadSortState(context)}
        />
      ),
      cell: ({ row }) => (
        <div className="ml-3 capitalize">{row.getValue('surname')}</div>
      ),
    },
    {
      accessorKey: 'surname',
      header: () => <SortTableHeadSkeleton title="Surname" />,
      cell: ({ row }) => (
        <Skeleton
          className={`ml-3 h-6`}
          style={{ width: row.original.surname }}
        />
      ),
    }
  )
  .addColumn(
    {
      accessorKey: 'email',
      header: (context) => (
        <SortTableHead
          title="Email"
          value="email"
          desc={getHeadSortState(context)}
        />
      ),
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
      accessorKey: 'role',
      header: (context) => (
        <SortTableHead
          title="Role"
          value="role"
          desc={getHeadSortState(context)}
        />
      ),
      cell: ({ row }) => <div className="ml-3">{row.getValue('role')}</div>,
    },
    {
      accessorKey: 'role',
      header: () => <SortTableHeadSkeleton title="Role" />,
      cell: ({ row }) => (
        <Skeleton className={`ml-3 h-6`} style={{ width: row.original.role }} />
      ),
    }
  )
  .addColumn(
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="text-right">
            <UserDropdownMenu user={user} />
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

function UserDropdownMenu({ user }: { user: User }) {
  const { data: session } = useSession();
  const { formAction } = useActionForm({
    action: deleteUser.bind(null, user.operatorCode),
    onSuccess: ({ message }) => {
      toast('User deleted', {
        icon: <lucide.User />,
        description: message,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const copyId = () => {
    navigator.clipboard.writeText(user.operatorCode.toString());
    toast('Copied operator code', {
      icon: <lucide.Copy />,
      description: `${user.surname} operator code has been saved to clipboard.`,
    });
  };

  const canEdit =
    session?.user && checkPermission(session.user.role, 'edit-user');

  const canDelete =
    session?.user && checkPermission(session.user.role, 'delete-user');

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <lucide.MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyId}>
            Copy operator code
          </DropdownMenuItem>

          {(canEdit || canDelete) && <DropdownMenuSeparator />}

          {canEdit && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/users/${user.operatorCode}/edit`}>
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
          <AlertDialogTitle>Are you sure to delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{' '}
            {user.name}. Do you wish to continue?
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
