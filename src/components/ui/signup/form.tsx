'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DarkModeToggle } from '../dark-mode-toggle';
import Link from 'next/link';
import { signup } from './actions';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { toast } from 'sonner';
import { useForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema, SignUpValues } from '@/lib/entities/user';
import { FormState } from '@/types/form';

const resolver = zodResolver(SignUpSchema);

const initialState: FormState<SignUpValues> = {
  message: '',
  success: false,
  values: { operatorCode: '' },
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { form, formAction } = useForm({
    resolver,
    initialState,
    action: signup,
    onSuccess: ({ message }) => {
      toast.warning(message);
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your operator code to register your new account!
            </CardDescription>
          </div>
          <DarkModeToggle />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction}>
              <FormField
                control={form.control}
                name="operatorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator Code</FormLabel>
                    <Input
                      type="text"
                      placeholder="e.g. 728930040aa476f94153be3c561ab548"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-6 w-full cursor-pointer">
                Sign Up
              </Button>

              <div className="mt-4 text-center text-sm">
                Already registered?{' '}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
