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

export const SignUpSchema = z.object({
  operatorCode: z.string().min(1, 'Operator code is required.'),
} satisfies Record<keyof Pick<User, 'operatorCode'>, any>);

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required. ' }),
  surname: z.string().min(1, { message: 'Surname is required. ' }),
  email: z.string().email('Invalid email.').min(1, 'Email is required.'),
  role: z.enum(RoleValues, { required_error: 'Role is required.' }),
} satisfies Record<keyof CreateUserDTO, any>);

export type UserValues = z.infer<typeof UserSchema>;
