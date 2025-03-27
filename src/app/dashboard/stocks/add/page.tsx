import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddStockForm } from '@/components/ui/dashboard/stocks/add-form';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Stocks',
    href: '/dashboard/stocks',
  },
  {
    label: 'Add Stock',
  },
];

export default function CreateStockPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new stock</CardTitle>
          </CardHeader>
          <CardContent>
            <AddStockForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
