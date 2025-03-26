'use server';

import { SignUpSchema, SignUpValues } from '@/lib/entities/user';
import { formatZodErrors } from '@/lib/utils';
import { ExtractRawValues, ExtractValues, FormState } from '@/types/form';

const extractRawValues: ExtractRawValues<SignUpValues> = (formData) => {
  return {
    operatorCode: formData.get('operatorCode')?.toString(),
  };
};

const extractValues: ExtractValues<SignUpValues> = (rawData) => {
  return {
    operatorCode: rawData.operatorCode ?? '',
  };
};

export async function signup(
  prevState: FormState<SignUpValues>,
  formData: FormData
): Promise<FormState<SignUpValues>> {
  // Extract and normalize form values
  const rawData = extractRawValues(formData);
  const values = extractValues(rawData);

  // Validate values
  const validatedFields = SignUpSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Missing or invalid fields. Cannot sign up.',
      values,
      errors: formatZodErrors(validatedFields.error),
    };
  }

  // Sign up
  return {
    message: 'Feature not available yet.',
    success: true,
    values,
  };
}
