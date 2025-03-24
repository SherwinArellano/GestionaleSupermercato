import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { CardWrapper } from '@/components/ui/dashboard/overview/card-wrapper';
import { ProductsTable } from '@/components/ui/dashboard/overview/products-table';
import { ProductsTableSkeleton } from '@/components/ui/dashboard/overview/products-table-skeleton';
import { CardWrapperSkeleton } from '@/components/ui/dashboard/overview/skeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { SalesTableSkeleton } from '@/components/ui/dashboard/overview/sales-table-skeleton';
import { SalesTable } from '@/components/ui/dashboard/overview/sales-table';

export const metadata: Metadata = {
  title: 'Overview',
};

export default function OverviewPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: 'Overview' }]} />

      <main className="flex flex-col gap-6 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<CardWrapperSkeleton />}>
            <CardWrapper />
          </Suspense>
        </div>
        <div className="grid items-start gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SalesTableSkeleton />}>
                <SalesTable />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ProductsTableSkeleton />}>
                <ProductsTable />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
