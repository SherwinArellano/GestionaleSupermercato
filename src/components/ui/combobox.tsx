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
import { FormControl, FormField, FormItem, FormLabel } from './form';

export type ComboboxItem = {
  value: string;
  label: string;
};

export function FormCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  items,
  onInput,
}: {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder: string;
  items: ComboboxItem[];
  onInput?: (value: string) => void;
}) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Combobox
              field={field}
              label={label}
              placeholder={placeholder}
              items={items}
              onInput={onInput}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function Combobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  field,
  placeholder,
  items,
  onInput,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root> & {
  label: string;
  field?: ControllerRenderProps<TFieldValues, TName>;
  placeholder: string;
  items: ComboboxItem[];
  onInput?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const commonValue = field ? field.value : value;

  const handleSelect = (currentValue: string) => {
    const updateValue = currentValue === commonValue ? '' : currentValue;
    if (field) field.onChange(updateValue);
    else setValue(updateValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-auto w-full cursor-pointer justify-between"
        >
          {commonValue
            ? items.find((item) => item.value === commonValue)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onInput={(e) => onInput?.(e.currentTarget.value)}
          />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      commonValue === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
