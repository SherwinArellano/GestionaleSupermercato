'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { addSale } from './actions';
import { SaleSchema, SaleValues } from '@/lib/entities/sale';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { DatePicker } from '../../form-input';
import { Input } from '../../input';
import { Package, Receipt } from 'lucide-react';
import React, { useEffect, useState, useTransition } from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '../../popover';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../command';
import { Command as CommandPrimitive } from 'cmdk';
import { CommandGroupContentSkeleton } from '../../combobox';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useSearchParams } from 'next/navigation';
import { Product } from '@/types/db';

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

export type ProductActionItem = {
  label: string;
  value: string;
  product: Product;
};

export type ProductAction = (
  state: ProductActionItem[],
  formData: FormData
) => Promise<ProductActionItem[]>;

export function AddSaleForm({
  productsAction,
  productsInitialInput,
}: {
  productsAction: ProductAction;
  productsInitialInput?: string;
}) {
  const { form, formAction, isPending } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: resolver as any,
    action: addSale,
    initialState: initialFormState,
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('Sale added', {
        icon: <Receipt />,
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

        <FormField
          name="products"
          control={form.control}
          render={() => (
            <ProductsInput
              action={productsAction}
              initialInput={productsInitialInput}
            />
          )}
        />

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

function ProductsInput({
  action,
  initialInput,
}: {
  action: ProductAction;
  initialInput?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialInput ?? '');
  const [items, formAction, isPending] = React.useActionState(action, []);
  const startTransition = useTransition()[1];
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleSelect = (product: Product) => {
    setSelectedProducts((products) => [...products, product]);
    setSearch('');

    const params = new URLSearchParams(searchParams);
    params.delete('product');
    history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  const handleInputChange = (value: string) => {
    submitProductQuery(value);
    setSearch(value);
  };

  const submitProductQuery = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('product', term);
    } else {
      params.delete('product');
    }

    history.pushState(null, '', `${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('input', search);
      formAction(formData);
    });
  }, [formAction, search, startTransition]);

  return (
    <FormItem>
      <FormLabel>Add Products</FormLabel>
      <Popover open={search !== ''} modal={false}>
        <CommandPrimitive loop shouldFilter={false}>
          <PopoverAnchor>
            <Input
              type="text"
              name="input"
              icon={<Package />}
              value={search}
              placeholder="e.g., Apple"
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </PopoverAnchor>
          <PopoverContent
            className="popover-content mt-1 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                {isPending ? (
                  <CommandGroupContentSkeleton />
                ) : (
                  items.map(({ label, value, product }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => handleSelect(product)}
                      className="cursor-pointer"
                    >
                      {label}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </CommandPrimitive>
      </Popover>

      {selectedProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </FormItem>
  );
}
