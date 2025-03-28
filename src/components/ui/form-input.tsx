'use client';

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
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { useState } from 'react';

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

export function DatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  disabled,
  disabledDate,
}: {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  disabled?: boolean;
  disabledDate?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <DatePickerFormItem
          label={label}
          field={field}
          disabled={disabled}
          disabledDate={disabledDate}
        />
      )}
    />
  );
}

function DatePickerFormItem<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  field,
  disabled,
  disabledDate,
}: {
  label: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  disabled?: boolean;
  disabledDate?: boolean;
}) {
  const [month, setMonth] = useState(field.value as Date);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div
          className={cn(
            'flex items-center gap-3',
            'rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]',
            'focus-within:ring-ring/50 rounded-md focus-within:ring-[3px]',
            'focus-within:border-ring px-3'
          )}
        >
          <input
            type="date"
            name={field.name}
            data-slot="input"
            className="border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 py-1 text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={format(field.value, 'yyyy-MM-dd')}
            onChange={(e) => field.onChange(new Date(e.target.value))}
            disabled={disabled}
          />
          <Popover>
            <PopoverTrigger asChild>
              <CalendarIcon className="ml-auto h-4 w-4 cursor-pointer opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={field.value}
                onSelect={field.onChange}
                disabled={disabledDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
