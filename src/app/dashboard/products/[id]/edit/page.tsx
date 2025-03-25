import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { EditProductForm } from '@/components/ui/dashboard/products/edit-form';
import db from '@/lib/db';
import { Product } from '@/types/db';
import { notFound } from 'next/navigation';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Products',
    href: '/dashboard/products',
  },
  {
    label: 'Edit Product',
  },
];

export default async function CreateProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  let product: Product | undefined;

  try {
    product = await db.products.getById(Number(id));
  } catch {
    notFound();
  }

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Editing {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditProductForm product={product} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
