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
import { authenticate } from './actions';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginValues } from '@/lib/entities/user';
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
import { FormState } from '@/types/form';

const resolver = zodResolver(LoginSchema);

const initialState: FormState<LoginValues> = {
  message: '',
  success: false,
  values: { email: '', password: '' },
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { form, formAction, isPending } = useForm({
    resolver,
    initialState,
    action: authenticate,
    onError: ({ message }) => {
      toast.warning(message);
    },
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="flex flex-row justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password below to login to your account
            </CardDescription>
          </div>
          <DarkModeToggle />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction}>
              <div className="mb-6 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {callbackUrl && (
                <input type="hidden" name="redirectTo" value={callbackUrl} />
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Login'}
              </Button>

              <div className="mt-4 text-center text-sm">
                Do you have an operator code?{' '}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
