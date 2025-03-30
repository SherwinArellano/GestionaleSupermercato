/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateUserDTO, LoginUserDTO, User } from '@/types/entities/user';
import { RoleValues } from '@/types/roles';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email.').min(1, 'Email is required.'),
  password: z
    .string()
    .min(6, 'Invalid password.')
    .min(1, 'Password is required.'),
} satisfies Record<keyof LoginUserDTO, any>);

export type LoginValues = z.infer<typeof LoginSchema>;

export const SignUpSchema = z
  .object({
    email: z.string(), // placeholder, not really needed
    operatorCode: z.string().min(1, 'Operator code is required.'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long.')
      .min(1, 'Password is required.'),
    confirmPassword: z.string(),
  } satisfies Record<
    keyof Pick<User, 'operatorCode' | 'email' | 'password'> | 'confirmPassword',
    any
  >)
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required. ' }),
  surname: z.string().min(1, { message: 'Surname is required. ' }),
  email: z.string().email('Invalid email.').min(1, 'Email is required.'),
  role: z.enum(RoleValues, { required_error: 'Role is required.' }),
} satisfies Record<keyof CreateUserDTO, any>);

export type UserValues = z.infer<typeof UserSchema>;
