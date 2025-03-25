import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { SuppliersAlert } from '@/components/ui/dashboard/suppliers/alert';
import { EditSupplierForm } from '@/components/ui/dashboard/suppliers/edit-form';
import db from '@/lib/db';
import { Supplier } from '@/types/db';
import { notFound } from 'next/navigation';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Suppliers',
    href: '/dashboard/suppliers',
  },
  {
    label: 'Edit Supplier',
  },
];

export default async function CreateSupplierPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  let supplier: Supplier | undefined;

  try {
    supplier = await db.suppliers.getById(Number(id));
  } catch {
    notFound();
  }

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <SuppliersAlert />

        <Card>
          <CardHeader>
            <CardTitle>Editing {supplier.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditSupplierForm supplier={supplier} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
