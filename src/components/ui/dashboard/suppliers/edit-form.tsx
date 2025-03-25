'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Factory, Mail, Phone } from 'lucide-react';
import { updateSupplier } from './actions';
import { SupplierSchema, SupplierValues } from '@/lib/entities/supplier';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { Supplier } from '@/types/db';
import { redirect } from 'next/navigation';

const resolver = zodResolver(SupplierSchema);

export function EditSupplierForm(props: { supplier: Supplier }) {
  const supplier = props.supplier;
  const initialState: FormState<SupplierValues> = {
    message: '',
    success: false,
    values: supplier,
  };

  const { form, formAction, isPending } = useForm({
    resolver,
    initialState,
    action: updateSupplier.bind(null, supplier.id),
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Supplier updated', {
        icon: <Factory />,
        description: message,
      });
      redirect('/dashboard/suppliers');
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const handlePhoneNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    // ignore all other inputs except '+', digits, and spaces
    e.currentTarget.value = currentValue.replace(/[^\+\d\s]/, '');
  };

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {isPending && <ScreenSpinner label="Updating supplier" />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Example Supplier"
                  icon={<Factory className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., mail@example.com"
                  icon={<Mail className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 123 Street, Example"
                  icon={<Building className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  onInput={handlePhoneNumberInput}
                  placeholder="e.g., +39 321 456 7890"
                  icon={<Phone className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="ml-auto block w-full cursor-pointer px-10 md:w-auto"
        >
          Edit Supplier
        </Button>
      </form>
    </Form>
  );
}
