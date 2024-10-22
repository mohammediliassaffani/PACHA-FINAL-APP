import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { FormSchemaType, ResponseType, RestFormData } from './schema';
import { catchError } from '@/common';
import { resetPassword } from './api';
import { toast } from 'sonner';

type Variables = FormSchemaType;
type Response = ResponseType;

export const useLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/sign-in',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
  onError: (err) => catchError(err),
});

export const useRestPassword = createMutation<
  { message: string },
  RestFormData,
  AxiosError
>({
  mutationFn: async (variables) =>
    resetPassword(variables.email, variables.newPassword),
  onError: (err) => catchError(err),
  onSuccess: (data) => {
    toast.success(data.message);
  },
});
