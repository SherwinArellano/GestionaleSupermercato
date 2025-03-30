'use server';

import { signIn, signOut } from '@/auth';
import { getRoleRedirectUrl } from '@/auth.config';
import db from '@/lib/db';
import { LoginSchema, LoginValues } from '@/lib/entities/user';
import { formatZodErrors } from '@/lib/utils';
import { ExtractRawValues, ExtractValues, FormState } from '@/types/form';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

const extractRawValues: ExtractRawValues<LoginValues> = (formData) => {
  return {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  };
};

const extractValues: ExtractValues<LoginValues> = (rawData) => {
  return {
    email: rawData.email ?? '',
    password: rawData.password ?? '',
  };
};

export async function authenticate(
  prevState: FormState<LoginValues>,
  formData: FormData
): Promise<FormState<LoginValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = LoginSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  try {
    const user = await db.users.getByEmail(values.email, {
      withOID: true,
      withPassword: true,
    });

    // Check if user exists
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials.', // This is a trick against hackers to make it seem like the user exists but doesn't.
        values,
      };
    }

    // Check if new user
    if (user.password === '') {
      return {
        success: false,
        message: 'New user detected. Please go to the sign up page.',
        values,
      };
    }

    // Login user
    await signIn('credentials', {
      redirectTo: getRoleRedirectUrl(user.role),
      ...values,
    });
    return {
      values,
      success: true,
      message: '',
    };
  } catch (error) {
    let message = '';
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          message = 'Invalid credentials.';
          break;
        default:
          message = 'Something went wrong.';
      }
    } else if (isRedirectError(error)) {
      // Doesn't redirect on logged in unless error is thrown.
      // Check: https://github.com/nextauthjs/next-auth/discussions/9389
      throw error;
    } else {
      message = 'Something went wrong.';
    }
    console.log(error);
    return {
      message,
      success: false,
      values,
    };
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}
