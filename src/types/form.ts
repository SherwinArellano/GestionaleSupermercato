export interface FormValues {
  [key: string]: unknown;
}

export interface FormError {
  [key: string]: { message: string };
}

export type RawData<Values extends FormValues> = {
  [Value in keyof Values]: string | undefined;
};

export type FormState<Values extends FormValues> = {
  message: string;
  values: Values;
  errors?: FormError;
  success: boolean;
};

export type ExtractRawValues<Values extends FormValues> = (
  formData: FormData
) => RawData<Values>;

export type ExtractValues<Values extends FormValues> = (
  rawData: RawData<Values>
) => Values;

export type GetEmptyValues<Values extends FormValues> = () => Values;
