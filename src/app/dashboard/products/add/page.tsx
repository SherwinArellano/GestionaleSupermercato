import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { AddProductForm } from '@/components/ui/dashboard/products/add-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Product',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Products',
    href: '/dashboard/products',
  },
  {
    label: 'Add Product',
  },
];

export default function CreateProductPage() {
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a new product</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
