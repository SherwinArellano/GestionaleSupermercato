'use server';

import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddStockForm } from '@/components/ui/dashboard/stocks/add-form';
import { productsAction, suppliersAction } from './actions';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Stocks',
    href: '/dashboard/stocks',
  },
  {
    label: 'Add Stock',
  },
];

type QueryParams = {
  supplier?: string;
  product?: string;
};

export default async function CreateStockPage(props: {
  searchParams?: Promise<QueryParams>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new stock</CardTitle>
          </CardHeader>
          <CardContent>
            <AddStockForm
              suppliersAction={suppliersAction}
              suppliersInitialInput={searchParams?.supplier}
              productsAction={productsAction}
              productsInitialInput={searchParams?.product}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
