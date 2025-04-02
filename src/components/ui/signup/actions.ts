'use server';

import db from '@/lib/db';
import { SignUpSchema, SignUpValues } from '@/lib/entities/user';
import { formatZodErrors } from '@/lib/utils';
import { ExtractRawValues, ExtractValues, FormState } from '@/types/form';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const extractRawValues: ExtractRawValues<SignUpValues> = (formData) => {
  return {
    email: formData.get('email')?.toString() ?? '',
    operatorCode: formData.get('operatorCode')?.toString(),
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
  };
};

const extractValues: ExtractValues<SignUpValues> = (rawData) => {
  return {
    email: rawData.email ?? '',
    operatorCode: rawData.operatorCode ?? '',
    password: rawData.password ?? '',
    confirmPassword: rawData.confirmPassword ?? '',
  };
};

export type SignUpFormState = FormState<SignUpValues> & {
  isSetPassword: boolean;
  registeredSuccessfully?: boolean;
};

export async function signup(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = !prevState.isSetPassword
    ? z
        .object({
          operatorCode: z.string().min(1, 'Operator code is required.'),
        })
        .safeParse(rawData)
    : SignUpSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      values,
      success: false,
      message: 'Missing or invalid fields. Cannot sign up.',
      isSetPassword: prevState.isSetPassword,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  try {
    const user = await db.users.getByOperatorCode(values.operatorCode, {
      withOID: true,
      withPassword: true,
    });

    // Check if user already signed up
    if (user && user.password !== '') {
      return {
        success: false,
        message: 'User already exists! Please login instead.',
        isSetPassword: false,
        values,
      };
    }

    // Check if user exists
    if (!user) {
      return {
        success: false,
        message: 'User does not exist!',
        isSetPassword: false,
        values,
      };
    }

    // Show up passwords input if user to be registered
    if (!prevState.isSetPassword) {
      values.email = user.email;
      return {
        success: true,
        isSetPassword: true,
        message: 'Please set your new password.',
        values,
      };
    }

    // Sign up
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(values.password, salt);

    user.password = hashedPassword;
    await user.save();

    return {
      message: 'User successfully registered. You may now log in.',
      success: true,
      isSetPassword: true,
      registeredSuccessfully: true,
      values,
    };
  } catch {
    return {
      success: false,
      message: 'Something went wrong.',
      isSetPassword: prevState.isSetPassword,
      values,
    };
  }
}
