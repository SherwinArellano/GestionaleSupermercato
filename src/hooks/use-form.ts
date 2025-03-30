import { FormState, FormValues } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState } from 'react';
import {
  FieldErrors,
  useForm as useReactForm,
  UseFormReturn,
} from 'react-hook-form';

export function useForm<Values extends FormValues>(props: {
  action: (
    prevState: FormState<Values>,
    formData: FormData
  ) => Promise<FormState<Values>>;
  initialState: FormState<Values>;
  resolver: ReturnType<typeof zodResolver<Values>>;
  onSuccess?: (result: FormState<Values>, form: UseFormReturn<Values>) => void;
  onError?: (result: FormState<Values>) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: FormState<Values>, formData: FormData) => {
      const result = await props.action(prevState, formData);
      if (result.success) {
        props.onSuccess?.(result, form);
      } else {
        props.onError?.(result);
      }
      return result;
    },
    props.initialState
  );

  const form = useReactForm<Values>({
    resolver: props.resolver,
    errors: state.errors as FieldErrors<Values>,
    values: state.values,
  });

  return {
    state,
    form,
    formAction,
    isPending,
  };
}

type FormActionState<Values extends FormValues> = Omit<
  FormState<Values>,
  'values' | 'errors'
>;
export function useActionForm<Values extends FormValues>(props: {
  action: (
    prevState: FormActionState<Values>,
    formData: FormData
  ) => Promise<FormActionState<Values>>;
  onSuccess?: (result: FormActionState<Values>) => void;
  onError?: (result: FormActionState<Values>) => void;
}) {
  const actions = useActionState(
    async (prevState: FormActionState<Values>, formData: FormData) => {
      const result = await props.action(prevState, formData);
      if (result.success) {
        props.onSuccess?.(result);
      } else {
        props.onError?.(result);
      }
      return result;
    },
    {} as FormActionState<Values>
  );

  return {
    formAction: actions[1],
    isPending: actions[2],
  };
}
