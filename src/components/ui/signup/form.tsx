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
import { signup, SignUpFormState } from './actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { toast } from 'sonner';
import { useForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '@/lib/entities/user';
import { redirect } from 'next/navigation';

const resolver = zodResolver(SignUpSchema);

const initialState: SignUpFormState = {
  message: '',
  success: false,
  isSetPassword: false,
  values: { operatorCode: '', email: '', confirmPassword: '', password: '' },
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const {
    state: rawState,
    form,
    formAction,
    isPending,
  } = useForm({
    resolver,
    initialState,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: signup as any,
    onSuccess: (rawState) => {
      const { message, registeredSuccessfully } = rawState as SignUpFormState;
      toast.success(message);
      if (registeredSuccessfully) redirect('/login');
    },
    onError: ({ message }) => {
      toast.warning(message);
    },
  });

  const state = rawState as SignUpFormState;

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
                disabled={state.isSetPassword}
                render={({ field }) => (
                  <FormItem className="mb-4">
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

              {state.isSetPassword && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="mt-2 w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Signing up...' : 'Sign Up'}
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
