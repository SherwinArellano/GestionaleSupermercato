'use server';

import { isAuthorized } from '@/lib/authorization';
import db from '@/lib/db';
import { UserSchema, UserValues } from '@/lib/entities/user';
import { formatZodErrors } from '@/lib/utils';
import {
  ExtractRawValues,
  ExtractValues,
  FormState,
  GetEmptyValues,
} from '@/types/form';
import { Role } from '@/types/roles';
import { revalidateTag } from 'next/cache';

const extractRawValues: ExtractRawValues<UserValues> = (formData) => {
  return {
    name: formData.get('name')?.toString(),
    surname: formData.get('surname')?.toString(),
    email: formData.get('email')?.toString(),
    role: formData.get('role')?.toString(),
  };
};

const extractValues: ExtractValues<UserValues> = (rawData) => {
  return {
    name: rawData.name ?? '',
    surname: rawData.surname ?? '',
    email: rawData.email ?? '',
    role: (rawData.role as Role) ?? 'cashier',
  };
};

const getEmptyValues: GetEmptyValues<UserValues> = () => {
  return {
    name: '',
    surname: '',
    email: '',
    role: 'cashier',
  };
};

export async function samplePopulate(): Promise<string> {
  return db.users.samplePopulate();
}

export async function addUser(
  prevState: FormState<UserValues>,
  formData: FormData
): Promise<FormState<UserValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = UserSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to add new user.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('create-user');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Create user
  try {
    const message = await db.users.create(validatedFields.data);

    revalidateTag('users');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to create new user.',
    };
  }
}

export async function updateUser(
  operatorCode: string,
  prevState: FormState<UserValues>,
  formData: FormData
): Promise<FormState<UserValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = UserSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Failed to update user.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Check if authorized
  const authorized = await isAuthorized('edit-user');
  if (!authorized) {
    return {
      values,
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Update user
  try {
    const message = await db.users.updateByOperatorCode(
      operatorCode,
      validatedFields.data
    );

    revalidateTag('users');

    return {
      message,
      success: true,
      values: getEmptyValues(),
    };
  } catch {
    return {
      values,
      success: false,
      message: 'Internal server error. Failed to update user.',
    };
  }
}

export async function deleteUser(
  operatorCode: string
): Promise<Omit<FormState<UserValues>, 'values' | 'errors'>> {
  // Check if authorized
  const authorized = await isAuthorized('delete-user');
  if (!authorized) {
    return {
      success: false,
      message: `You don't have permission to do that.`,
    };
  }

  // Delete user
  try {
    const message = await db.users.deleteByOperatorCode(operatorCode);

    revalidateTag('users');

    return {
      message,
      success: true,
    };
  } catch {
    return {
      message: 'Internal server error. Failed to delete user.',
      success: false,
    };
  }
}
