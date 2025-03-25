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
import { Euro, Package, Tag } from 'lucide-react';
import { addProduct } from './actions';
import { ProductSchema, ProductValues } from '@/lib/entities/product';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';

const resolver = zodResolver(ProductSchema);

const initialFormState: FormState<ProductValues> = {
  message: '',
  success: false,
  values: {
    name: '',
    category: '',
    sellingPrice: 0,
  },
};

export function AddProductForm() {
  const { form, formAction, isPending } = useForm({
    resolver,
    action: addProduct,
    initialState: initialFormState,
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Product created', {
        icon: <Package />,
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
        {isPending && <ScreenSpinner label="Adding product" />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., T-shirt"
                  icon={<Package className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g., 29.99"
                  icon={<Euro className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Clothing"
                  icon={<Tag className="h-5 w-5" strokeWidth={1} />}
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
          Add Product
        </Button>
      </form>
    </Form>
  );
}
