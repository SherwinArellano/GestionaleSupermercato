import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Invalid password')
    .min(1, 'Password is required'),
});

export type UserValues = z.infer<typeof UserSchema>;
