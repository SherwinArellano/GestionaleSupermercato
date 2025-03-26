/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginUserDTO, User } from '@/types/entities/user';
import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email('Invalid email.').min(1, 'Email is required.'),
  password: z
    .string()
    .min(6, 'Invalid password.')
    .min(1, 'Password is required.'),
} satisfies Record<keyof LoginUserDTO, any>);

export type UserValues = z.infer<typeof UserSchema>;

export const SignUpSchema = z.object({
  operatorCode: z.string().min(1, 'Operator code is required.'),
} satisfies Record<keyof Pick<User, 'operatorCode'>, any>);

export type SignUpValues = z.infer<typeof SignUpSchema>;
