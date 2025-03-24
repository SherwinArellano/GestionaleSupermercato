import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { PopulateProductsButton } from '@/components/ui/dashboard/products/populate-products';
import { ProductsTable } from '@/components/ui/dashboard/products/products-table';
import { ProductsTableSkeleton } from '@/components/ui/dashboard/products/products-table-skeleton';
import { SearchInput } from '@/components/ui/data-table';
import { env } from '@/data/env/server';
import { Plus, RefreshCcw } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

export const metadata: Metadata = {
  title: 'Products',
};

type QueryParams = {
  search?: string;
  page?: string;
  order?: 'asc' | 'desc';
  sort?: string;
};

export default async function ProductsPage(props: {
  searchParams?: Promise<QueryParams>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: 'Products' }]} />

      <main className="grid gap-6 p-6">
        <div className="w-full min-w-0">
          <div className="mb-4 flex items-center gap-4">
            <SearchInput className="flex-1" placeholder="Find products..." />

            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={async () => {
                'use server';
                revalidateTag('products');
              }}
            >
              <RefreshCcw />
            </Button>

            <Button
              type="button"
              variant="default"
              className="cursor-pointer"
              asChild
            >
              <Link href="/dashboard/products/add">
                <Plus />
                New Product
              </Link>
            </Button>
          </div>

          <Suspended searchParams={searchParams} />

          {env.NODE_ENV === 'development' && (
            <PopulateProductsButton className="hidden" />
          )}
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

  cacheTag('products');

  // When cacheTag revalidates, the `now` changes
  // makine Suspense to rerender.
  // This is to trigger skeleton loading when
  // the user presses on the refresh button.
  const now = Date.now();

  const search = searchParams?.search ?? '';
  const order = searchParams?.order ?? 'asc';
  const sort = searchParams?.sort ?? 'name';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense
      key={now + search + currentPage + order + sort}
      fallback={<ProductsTableSkeleton />}
    >
      <ProductsTable
        search={search}
        currentPage={currentPage}
        order={order}
        sort={sort}
      />
    </Suspense>
  );
}
