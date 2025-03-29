'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Skeleton } from './skeleton';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useSearchParams } from 'next/navigation';

export type ComboboxItem = {
  value: string;
  label: string;
};

export type ComboboxAction = (
  state: ComboboxItem[],
  formData: FormData
) => Promise<ComboboxItem[]>;

export type ComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  label: string;
  query: string;
  noneFoundLabel: string;
  initialContentLabel: string;
  initialInput?: string;
  initialValue?: string;
  field?: ControllerRenderProps<TFieldValues, TName>;
  placeholder: string;
  action: ComboboxAction;
  onInput?: (value: string) => void;
  onPopoverState?: (open: boolean) => void;
};

export function FormCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  ...props
}: ComboboxProps<TFieldValues, TName> & {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
}) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Combobox field={field} label={label} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Combobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  noneFoundLabel,
  initialContentLabel,
  field,
  initialInput,
  initialValue,
  action,
  placeholder,
  onInput,
  onPopoverState,
  query,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> &
  ComboboxProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [valueLabel, setValueLabel] = React.useState(initialValue ?? '');
  const [input, setInput] = React.useState(initialInput ?? '');
  const [items, formAction, isPending] = React.useActionState(action, []);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const formRef = React.useRef<HTMLFormElement>(null);
  const firstRef = React.useRef(true);
  const commonValue = field ? field.value : value;

  React.useEffect(() => {
    onPopoverState?.(open);
  }, [open, onPopoverState]);

  const handleSelect = (selectedValue: string, label: string) => {
    const updatedValue = selectedValue === commonValue ? '' : selectedValue;
    if (field) field.onChange(updatedValue);
    else setValue(updatedValue);
    setValueLabel(label);
    setOpen(false);
  };

  const submit = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set(query, term);
    } else {
      params.delete(query);
    }

    history.pushState(null, '', `${pathname}?${params.toString()}`);
    formRef.current?.requestSubmit();
  }, 300);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      {field && <input type="hidden" name={field.name} value={field.value} />}

      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto w-full cursor-pointer justify-between"
          onClick={() => {
            if (!firstRef.current) return;
            submit(input);
            firstRef.current = false;
          }}
        >
          {commonValue && valueLabel ? valueLabel : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content w-full p-0">
        <form action={formAction} ref={formRef}>
          <Command shouldFilter={false} loop>
            <CommandInput
              name="input"
              value={input}
              placeholder={placeholder}
              className="h-9"
              onInput={(e) => {
                onInput?.(e.currentTarget.value);
                setInput(e.currentTarget.value);
                submit(e.currentTarget.value);
              }}
            />
            <CommandList>
              <CommandEmpty>
                {input ? noneFoundLabel : initialContentLabel}
              </CommandEmpty>
              <CommandGroup>
                {isPending ? (
                  <CommandGroupContentSkeleton />
                ) : (
                  <CommandGroupContent
                    items={items}
                    value={commonValue}
                    onSelect={handleSelect}
                  />
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function CommandGroupContent({
  items,
  value,
  onSelect,
}: {
  value: string;
  items: ComboboxItem[];
  onSelect: (value: string, label: string) => void;
}) {
  return items.map((item) => (
    <CommandItem
      key={item.value}
      value={item.value}
      onSelect={(selectedValue) => {
        const valueLabel =
          items.find((item) => item.value === selectedValue)?.label ?? '';
        onSelect(selectedValue, valueLabel);
      }}
      className="cursor-pointer"
    >
      {item.label}
      <Check
        className={cn(
          'ml-auto',
          // The reason why it's value.toString() is because I saw it
          // too late that form.control.field doesn't return the correct
          // type because value here could either be a string
          // or a number.
          value.toString() === item.value ? 'opacity-100' : 'opacity-0'
        )}
      />
    </CommandItem>
  ));
}

function CommandGroupContentSkeleton() {
  return Array.from(Array(5)).map((_, i) => (
    <CommandItem key={i} value={i.toString()} disabled>
      <Skeleton
        className="h-5"
        style={{ width: Math.floor(Math.random() * 110 + 70) }}
      />
    </CommandItem>
  ));
}
