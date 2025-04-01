import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { EditSaleForm } from '@/components/ui/dashboard/sales/edit-form';
import db from '@/lib/db';
import { Product, PSale, PSaleProduct } from '@/types/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Sale',
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Sales',
    href: '/dashboard/sales',
  },
  {
    label: 'Edit Sale',
  },
];

export default async function CreateSalePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id) || 0;
  let sale: PSale | undefined;

  try {
    // For now, this is getting all sales.
    const { products: saleProducts, ...data } = await db.sales.getById(id);

    // Populate sales
    const products = await db.products.getAll();
    const deletedProduct: Product = {
      id: -1,
      name: 'Deleted product',
      sellingPrice: 0,
      stocks: [],
      category: {
        id: -1,
        name: 'Unknown',
      },
    };

    sale = {
      products: saleProducts.map<PSaleProduct>(({ id, quantity }) => {
        const product = products.find((p) => p.id === id) ?? deletedProduct;
        return {
          quantity,
          ...product,
        };
      }),
      ...data,
    };
  } catch {
    notFound();
  }

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className="grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Editing {sale.receiptCode}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditSaleForm sale={sale} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
