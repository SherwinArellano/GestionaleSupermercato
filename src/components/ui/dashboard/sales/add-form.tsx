'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Boxes } from 'lucide-react';
import { addSale } from './actions';
import { SaleSchema, SaleValues } from '@/lib/entities/sale';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { DatePicker } from '../../form-input';

const resolver = zodResolver(SaleSchema);

const dateNow = new Date();
const initialFormState: FormState<SaleValues> = {
  message: '',
  success: false,
  values: {
    saleDate: dateNow,
    products: [],
  },
};

export function AddSaleForm() {
  const { form, formAction, isPending } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: resolver as any,
    action: addSale,
    initialState: initialFormState,
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Sale added', {
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
        {isPending && <ScreenSpinner label="Adding sale" />}

        <DatePicker control={form.control} name="saleDate" label="Sale Date" />

        <Button
          type="submit"
          className="ml-auto block w-full cursor-pointer px-10 md:w-auto"
        >
          Add Sale
        </Button>
      </form>
    </Form>
  );
}
