import axios from 'axios';
import { client } from '../common';
import { FormSchemaType, responseSchema, ResponseType } from './schema';
import Env from '@/env.generated';
import { getRefreshToken } from '@/store';

export const login = async (data: FormSchemaType) => {
  const res = await client.post<ResponseType>(`/auth/sign-in`, data);

  return responseSchema.parse(res.data);
};
export const logout = async () => {
  const token = getRefreshToken();
  await axios.get<ResponseType>(`${Env.VITE_API_URL}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const hasPassword = async (): Promise<boolean> => {
  const res = await axios.get<boolean>(
    `${Env.VITE_API_URL}/auth/has-rest-password`
  );
  return res.data;
};
export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<{ message: string }> => {
  const res = await axios.post<{ message: string }>(
    `${Env.VITE_API_URL}/auth/rest-password`,
    { email, newPassword }
  );
  return res.data;
};
