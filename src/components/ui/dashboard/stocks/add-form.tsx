'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Boxes } from 'lucide-react';
import { addStock } from './actions';
import { StockSchema, StockValues } from '@/lib/entities/stock';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { DatePicker, IntegerInput } from '../../form-input';
import { ComboboxAction, FormCombobox } from '../../combobox';

const resolver = zodResolver(StockSchema);

const dateNow = new Date();
const initialFormState: FormState<StockValues> = {
  message: '',
  success: false,
  values: {
    arrivalDate: dateNow,
    expiryDate: dateNow,
    productId: 0,
    supplierId: 0,
    quantity: 0,
  },
};

export function AddStockForm({
  suppliersAction,
  suppliersInitialInput,
  productsAction,
  productsInitialInput,
}: {
  suppliersInitialInput?: string;
  suppliersAction: ComboboxAction;
  productsInitialInput?: string;
  productsAction: ComboboxAction;
}) {
  const { form, formAction, isPending } = useForm({
    resolver,
    action: addStock,
    initialState: initialFormState,
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Stock added', {
        icon: <Boxes />,
        description: message,
      });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {isPending && <ScreenSpinner label="Adding stock" />}

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
          query="product"
          noneFoundLabel="No products found."
          initialContentLabel="Start typing for a product."
          placeholder="Select product..."
          action={productsAction}
          initialInput={productsInitialInput}
        />

        <FormCombobox
          control={form.control}
          name="supplierId"
          label="Supplier"
          query="supplier"
          noneFoundLabel="No suppliers found."
          initialContentLabel="Start typing for a supplier."
          placeholder="Select supplier..."
          action={suppliersAction}
          initialInput={suppliersInitialInput}
        />

        <Button
          type="submit"
          className="ml-auto block w-full cursor-pointer px-10 md:w-auto"
        >
          Add Stock
        </Button>
      </form>
    </Form>
  );
}
