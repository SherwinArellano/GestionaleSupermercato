import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { SearchInput } from '@/components/ui/data-table';
import { Plus, RefreshCcw } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { checkPermission } from '@/authorization';
import { UsersTableSkeleton } from '@/components/ui/dashboard/users/table-skeleton';
import { UsersTable } from '@/components/ui/dashboard/users/table';

export const metadata: Metadata = {
  title: 'Users',
};

type QueryParams = {
  search?: string;
  page?: string;
  order?: 'asc' | 'desc';
  sort?: string;
};

export default async function UsersPage(props: {
  searchParams?: Promise<QueryParams>;
}) {
  const session = await auth();
  const user = session?.user;
  const searchParams = await props.searchParams;

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: 'Users' }]} />

      <main className="grid gap-6 p-6">
        <div className="w-full min-w-0">
          <div className="mb-4 flex items-center gap-4">
            <SearchInput className="flex-1" placeholder="Find users..." />

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={async () => {
                'use server';
                revalidateTag('users');
              }}
            >
              <RefreshCcw />
            </Button>

            {user && checkPermission(user.role, 'create-user') && (
              <Button
                type="button"
                variant="default"
                className="cursor-pointer"
                asChild
              >
                <Link href="/dashboard/users/add">
                  <Plus />
                  New User
                </Link>
              </Button>
            )}
          </div>

          <Suspended searchParams={searchParams} />
        </div>
      </main>
    </>
  );
}

async function Suspended({
  searchParams,
}: {
  searchParams: QueryParams | undefined;
}) {
  const now = Date.now();

  const search = searchParams?.search ?? '';
  const order = searchParams?.order ?? 'asc';
  const sort = searchParams?.sort ?? 'name';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense
      key={now + search + currentPage + order + sort}
      fallback={<UsersTableSkeleton />}
    >
      <UsersTable
        search={search}
        currentPage={currentPage}
        order={order}
        sort={sort}
      />
    </Suspense>
  );
}
