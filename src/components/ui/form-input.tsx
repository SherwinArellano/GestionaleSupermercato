'use client';

import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';

export function IntegerInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder: string;
}) {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;
    // ignore all other inputs except '+', digits, and spaces
    e.currentTarget.value = currentValue.replace(/[^\d]/, '');
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="1"
              placeholder={placeholder}
              onInput={handleInput}
              // icon={<icon.name className="h-5 w-5" strokeWidth={1} />}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
