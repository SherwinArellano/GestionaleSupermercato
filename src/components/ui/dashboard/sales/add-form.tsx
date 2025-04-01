'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { addSale, autocompleteProducts } from './actions';
import { SaleSchema, SaleValues } from '@/lib/entities/sale';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { DatePicker } from '../../form-input';
import { Input } from '../../input';
import { Package, Receipt, X } from 'lucide-react';
import React, {
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '../../popover';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../command';
import { Command as CommandPrimitive } from 'cmdk';
import { CommandGroupContentSkeleton } from '../../combobox';
import { usePathname, useSearchParams } from 'next/navigation';
import { Product, SaleProduct } from '@/types/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import { Label } from '../../label';

const resolver = zodResolver(SaleSchema);

const dateNow = new Date();
const initialFormState: FormState<SaleValues> = {
  message: '',
  success: false,
  values: {
    saleDate: dateNow,
    products: [],
    totalPrice: 0,
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

type ProductsInputRef = { reset: () => void };

export function AddSaleForm() {
  const productsInputRef = useRef<ProductsInputRef>(null);
  const { form, formAction, isPending } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: resolver as any,
    action: addSale,
    initialState: initialFormState,
    onSuccess: ({ message }, form) => {
      form.reset();
      productsInputRef.current?.reset();
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
          render={() => <ProductsInput ref={productsInputRef} />}
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

type SaleProductTableItem = Product & { quantityString: string };

function ProductsInput({ ref }: { ref?: Ref<ProductsInputRef> }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [items, formAction, isPending] = React.useActionState(
    autocompleteProducts,
    []
  );
  const startTransition = useTransition()[1];
  const [selectedProducts, setSelectedProducts] = useState<
    SaleProductTableItem[]
  >([]);

  useEffect(() => {
    startTransition(() => {
      formAction();
    });
  }, [formAction, startTransition]);

  const saleProductsJSON = useMemo<string>(
    () =>
      JSON.stringify(
        selectedProducts.map<SaleProduct>(({ id, quantityString }) => ({
          id,
          quantity: Number(quantityString) || 0,
        }))
      ),
    [selectedProducts]
  );

  const totalPrice = useMemo<number>(
    () =>
      selectedProducts.reduce((amount, product) => {
        const quantity = Number(product.quantityString) || 0;
        return amount + quantity * product.sellingPrice;
      }, 0),
    [selectedProducts]
  );

  const handleSelect = (product: Product) => {
    setSelectedProducts((products) => [
      { quantityString: '1', ...product },
      ...products,
    ]);
    setSearch('');

    const params = new URLSearchParams(searchParams);
    params.delete('product');
    history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  const handleInputChange = (value: string) => {
    setSearch(value);
  };

  const handleProductRemove = (id: number) => {
    setSelectedProducts((products) => products.filter((p) => p.id !== id));
  };

  const handleProductQuantityChange = (
    productId: number,
    quantityString: string
  ) => {
    setSelectedProducts((products) => {
      const updatedProduct = products.find(({ id }) => productId === id);
      if (!updatedProduct) return products;
      updatedProduct.quantityString = quantityString;
      return products.map((product) =>
        product.id === productId ? updatedProduct : product
      );
    });
  };

  useImperativeHandle(ref, () => {
    return {
      reset() {
        setSelectedProducts([]);
      },
    };
  });

  const filteredItems = useMemo(
    () =>
      items.filter(({ product }) => {
        if (selectedProducts.find(({ id }) => id === product.id)) {
          return false;
        }
        if (search === '') return true;
        return product.name.toLowerCase().includes(search.toLowerCase());
      }),
    [items, search, selectedProducts]
  );

  return (
    <FormItem>
      <FormLabel>Add Products</FormLabel>
      <input type="hidden" name="products" value={saleProductsJSON} />
      <input type="hidden" name="totalPrice" value={totalPrice} />
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
            <CommandList className="max-h-full">
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                {isPending ? (
                  <CommandGroupContentSkeleton />
                ) : (
                  filteredItems.map(({ label, value, product }) => (
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

      <div className="mt-2 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] pl-3">Quantity</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="pr-3 text-right">Amount</TableHead>
              <TableHead className="w-[32px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-72">
                  <span className="flex justify-center gap-2.5">
                    No selected products yet.
                  </span>
                </TableCell>
              </TableRow>
            )}
            {selectedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableHead className="w-[120px] pl-3">
                  <Input
                    type="number"
                    step={1}
                    className="text-primary"
                    value={product.quantityString}
                    min={0}
                    placeholder="0"
                    onKeyDown={(e) =>
                      ['e', '.', '-'].includes(e.key) && e.preventDefault()
                    }
                    onChange={(e) =>
                      handleProductQuantityChange(product.id, e.target.value)
                    }
                  />
                </TableHead>
                <TableCell>{product.name}</TableCell>
                <TableCell className="pr-3 text-right">
                  €{(product.sellingPrice / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => handleProductRemove(product.id)}
                  >
                    <X />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <FormMessage />

      <div>
        <Label className="mt-2">
          Total Price: €{(totalPrice / 100).toFixed(2)}
        </Label>
      </div>
    </FormItem>
  );
}
