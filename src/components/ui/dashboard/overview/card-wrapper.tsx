import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/lib/db';
import { currencyFormatter } from '@/lib/utils';
import { isAxiosError } from 'axios';
import { Banknote, Factory, LucideIcon, Package, Users } from 'lucide-react';
import { ShowToast } from './show-toast';
import { users } from '@/lib/db/users';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function CardWrapper() {
  'use cache';

  cacheTag('products');

  let productsCount: number;
  let isError = false;

  try {
    const { totalElements } = await db.products.get();
    productsCount = totalElements;
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
      <OverviewCard title="Total Sales" icon={Banknote} value={0} isCurrency />
      <OverviewCard
        title="Total Products"
        icon={Package}
        value={productsCount}
      />
      <OverviewCard title="Total Suppliers" icon={Factory} value={0} />
      <OverviewCard title="Total Users" icon={Users} value={users.length} />
    </>
  );
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
