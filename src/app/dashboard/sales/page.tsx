import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { SearchInput } from '@/components/ui/data-table';
import { Plus, RefreshCcw } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';
import { auth } from '@/auth';
import { checkPermission } from '@/authorization';
import { SalesTable } from '@/components/ui/dashboard/sales/table';
import { SalesTableSkeleton } from '@/components/ui/dashboard/sales/table-skeleton';

export const metadata: Metadata = {
  title: 'Sale',
};

type QueryParams = {
  search?: string;
  page?: string;
  order?: 'asc' | 'desc';
  sort?: string;
};

export default async function SalePage(props: {
  searchParams?: Promise<QueryParams>;
}) {
  const session = await auth();
  const user = session?.user;
  const searchParams = await props.searchParams;

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: 'Sales' }]} />

      <main className="grid gap-6 p-6">
        <div className="w-full min-w-0">
          <div className="mb-4 flex items-center gap-4">
            <SearchInput className="flex-1" placeholder="Find sale..." />

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={async () => {
                'use server';
                revalidateTag('sales');
              }}
            >
              <RefreshCcw />
            </Button>

            {user && checkPermission(user.role, 'create-sale') && (
              <Button
                type="button"
                variant="default"
                className="cursor-pointer"
                asChild
              >
                <Link href="/dashboard/sales/add">
                  <Plus />
                  New Sale
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
  'use cache';

  cacheTag('sales');

  // When cacheTag revalidates, the `now` changes
  // makine Suspense to rerender.
  // This is to trigger skeleton loading when
  // the user presses on the refresh button.
  const now = Date.now();

  const search = searchParams?.search ?? '';
  const order = searchParams?.order ?? 'asc';
  const sort = searchParams?.sort ?? 'receiptCode';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense
      key={now + search + currentPage + order + sort}
      fallback={<SalesTableSkeleton />}
    >
      <SalesTable
        search={search}
        currentPage={currentPage}
        order={order}
        sort={sort}
      />
    </Suspense>
  );
}
