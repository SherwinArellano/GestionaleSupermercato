import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/lib/entities/user';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await db.users.getByEmail(email, { withPassword: true });

        if (!user) return null;

        const passwordsMatched = await bcrypt.compare(password, user.password);
        if (!passwordsMatched) return null;

        return user;
      },
    }),
  ],
});
