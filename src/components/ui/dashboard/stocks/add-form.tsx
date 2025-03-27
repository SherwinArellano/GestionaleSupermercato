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
import { ComboboxItem, FormCombobox } from '../../combobox';

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

const sampleItems: ComboboxItem[] = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

export function AddStockForm() {
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
          items={sampleItems}
          label="Product"
          placeholder="Select product..."
        />

        <FormCombobox
          control={form.control}
          name="supplierId"
          items={sampleItems}
          label="Supplier"
          placeholder="Select supplier..."
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
