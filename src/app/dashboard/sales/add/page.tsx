import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddSaleForm } from '@/components/ui/dashboard/sales/add-form';
import { Metadata } from 'next';
import { productsAction } from '../actions';

export const metadata: Metadata = {
  title: 'Add Sale',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Sales',
    href: '/dashboard/sales',
  },
  {
    label: 'Add Sale',
  },
];

type QueryParams = {
  product?: string;
};

export default async function CreateSalePage(props: {
  searchParams?: Promise<QueryParams>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new sale</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSaleForm
              productsAction={productsAction}
              productsInitialInput={searchParams?.product}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
