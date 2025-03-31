import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddSupplierForm } from '@/components/ui/dashboard/suppliers/add-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Supplier',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Suppliers',
    href: '/dashboard/suppliers',
  },
  {
    label: 'Add Supplier',
  },
];

export default function CreateSupplierPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSupplierForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
