'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { updateStock } from './actions';
import { StockSchema, StockValues } from '@/lib/entities/stock';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { PStock } from '@/types/db';
import { DatePicker, IntegerInput } from '../../form-input';
import { ComboboxAction, FormCombobox } from '../../combobox';
import { Boxes } from 'lucide-react';
import { redirect } from 'next/navigation';

const resolver = zodResolver(StockSchema);

export function EditStockForm({
  stock,
  suppliersAction,
  suppliersInitialInput,
  productsAction,
  productsInitialInput,
}: {
  stock: PStock;
  suppliersInitialInput?: string;
  suppliersAction: ComboboxAction;
  productsInitialInput?: string;
  productsAction: ComboboxAction;
}) {
  const initialState: FormState<StockValues> = {
    message: '',
    success: false,
    values: {
      arrivalDate: stock.arrivalDate,
      expiryDate: stock.expiryDate,
      quantity: stock.quantity,
      productId: stock.product.id,
      supplierId: stock.supplier.id,
    },
  };

  const { form, formAction, isPending } = useForm({
    resolver,
    initialState,
    action: updateStock.bind(null, stock.id),
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Stock updated', {
        icon: <Boxes />,
        description: message,
      });
      redirect('/dashboard/stocks');
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {isPending && <ScreenSpinner label="Updating stock" />}

        <IntegerInput
          control={form.control}
          name="quantity"
          label="Quantity"
          placeholder="e.g., 10"
        />

        <DatePicker
          control={form.control}
          name="arrivalDate"
          label="Arrival Date"
        />

        <DatePicker
          control={form.control}
          name="expiryDate"
          label="Expiry Date"
        />

        <FormCombobox
          control={form.control}
          name="productId"
          label="Product"
          noneFoundLabel="No products found."
          initialContentLabel="Start typing for a product."
          placeholder="Select product..."
          action={productsAction}
          initialInput={productsInitialInput}
          initialValue={stock.product.name}
        />

        <FormCombobox
          control={form.control}
          name="supplierId"
          label="Supplier"
          noneFoundLabel="No suppliers found."
          initialContentLabel="Start typing for a supplier."
          placeholder="Select supplier..."
          action={suppliersAction}
          initialInput={suppliersInitialInput}
          initialValue={stock.supplier.name}
        />

        <Button
          type="submit"
          className="ml-auto block w-full cursor-pointer px-10 md:w-auto"
        >
          Update Stock
        </Button>
      </form>
    </Form>
  );
}
