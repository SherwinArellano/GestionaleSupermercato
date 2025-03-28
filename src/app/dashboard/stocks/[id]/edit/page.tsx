import { Breadcrumb } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/dashboard/header';
import { EditStockForm } from '@/components/ui/dashboard/stocks/edit-form';
import db from '@/lib/db';
import { PStock } from '@/types/db';
import { notFound } from 'next/navigation';
import { productsAction, suppliersAction } from '../../actions';

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Stocks',
    href: '/dashboard/stocks',
  },
  {
    label: 'Edit Stock',
  },
];

type QueryParams = {
  supplier?: string;
  product?: string;
};

export default async function CreateStockPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<QueryParams>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const id = params.id;

  let stock: PStock | undefined;

  try {
    const unpopulatedStock = await db.stocks.getById(Number(id));
    stock = {
      id: unpopulatedStock.id,
      quantity: unpopulatedStock.quantity,
      arrivalDate: unpopulatedStock.arrivalDate,
      expiryDate: unpopulatedStock.expiryDate,
      product: await db.products.getById(unpopulatedStock.productId),
      supplier: await db.suppliers.getById(unpopulatedStock.supplierId),
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
            <CardTitle>Editing stock {stock.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditStockForm
              stock={stock}
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
