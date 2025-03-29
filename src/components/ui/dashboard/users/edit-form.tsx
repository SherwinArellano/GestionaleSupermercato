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
import { Check, ChevronsUpDown, Mail, User, Users } from 'lucide-react';
import { updateUser } from './actions';
import { UserSchema, UserValues } from '@/lib/entities/user';
import { toast } from 'sonner';
import { ScreenSpinner } from '../../spinner';
import { FormState } from '@/types/form';
import { useForm } from '@/hooks/use-form';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { RoleValues } from '@/types/roles';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { cn } from '@/lib/utils';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import * as db from '@/types/db';

const resolver = zodResolver(UserSchema);

export function EditUserForm(props: { user: db.User }) {
  const user = props.user;
  const initialState: FormState<UserValues> = {
    message: '',
    success: false,
    values: user,
  };

  const { form, formAction, isPending } = useForm({
    resolver,
    initialState,
    action: updateUser.bind(null, user.operatorCode),
    onSuccess: ({ message }, form) => {
      form.reset();
      toast('User updated', {
        icon: <User />,
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
        {isPending && <ScreenSpinner label="Updating user" />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Bob"
                  icon={<User className="h-5 w-5" strokeWidth={1} />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Smith"
                  icon={<Users className="h-5 w-5" strokeWidth={1} />}
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
                  disabled
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RoleCombobox field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="ml-auto block w-full cursor-pointer px-10 md:w-auto"
        >
          Update User
        </Button>
      </form>
    </Form>
  );
}

function RoleCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) {
  const [open, setOpen] = useState(false);
  const value = field.value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={field.name} value={field.value} />

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full cursor-pointer justify-between"
        >
          {value ? value[0].toUpperCase() + value.slice(1) : 'Select role...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content w-full p-0">
        <Command>
          <CommandInput placeholder="Search role..." className="h-9" />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {RoleValues.map((role) => (
                <CommandItem
                  key={role}
                  value={role}
                  className="cursor-pointer"
                  onSelect={(currentValue) => {
                    field.onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {role[0].toUpperCase() + role.slice(1)}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === role ? 'opacity-100' : 'opacity-0'
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
