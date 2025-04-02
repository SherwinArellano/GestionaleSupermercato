import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { currencyFormatter } from '@/lib/utils';
import { isAxiosError } from 'axios';
import { Banknote, Factory, LucideIcon, Package, Users } from 'lucide-react';
import { ShowToast } from './show-toast';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function CardWrapper() {
  return (
    <>
      <SalesOverviewCard />
      <ProductsOverviewCard />
      <SuppliersOverviewCard />
      <UsersOverviewCard />
    </>
  );
}

async function SalesOverviewCard() {
  'use cache';

  cacheTag('sales');

  let overallPrice: number;

  try {
    overallPrice = await db.sales.getOverallPrice();
  } catch {
    overallPrice = 0;
  }

  return (
    <OverviewCard
      title="Total Sales"
      icon={Banknote}
      value={overallPrice}
      isCurrency
    />
  );
}

async function ProductsOverviewCard() {
  let productsCount: number;
  let isError = false;

  try {
    const products = await db.products.getAll();
    productsCount = products.length;
  } catch (e) {
    if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
      isError = true;
    }

    productsCount = 0;
  }

  return (
    <>
      <ShowToast
        message="Could not fetch data. Server is probably down."
        isError={isError}
      />
      <OverviewCard
        title="Total Products"
        icon={Package}
        value={productsCount}
      />
    </>
  );
}

async function SuppliersOverviewCard() {
  'use cache';

  cacheTag('suppliers');

  let suppliersCount: number;

  try {
    suppliersCount = (await db.suppliers.get()).totalElements;
  } catch {
    suppliersCount = 0;
  }

  return (
    <OverviewCard
      title="Total Suppliers"
      icon={Factory}
      value={suppliersCount}
    />
  );
}

async function UsersOverviewCard() {
  'use cache';

  cacheTag('users');

  let usersCount: number;

  try {
    usersCount = (await db.users.get()).length;
  } catch {
    usersCount = 0;
  }

  return <OverviewCard title="Total Users" icon={Users} value={usersCount} />;
}

function OverviewCard(props: {
  title: string;
  value: number;
  isCurrency?: boolean;
  icon: LucideIcon;
}) {
  return (
    <Card className="gap-1.5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-1.5">
          {props.title}
          <props.icon className="text-muted-foreground h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {props.isCurrency
            ? currencyFormatter.format(props.value)
            : props.value}
        </div>
      </CardContent>
    </Card>
  );
}
