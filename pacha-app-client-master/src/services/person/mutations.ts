import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { PersonType } from './schema';
import { createPerson, deleteMany } from './api';
import { updatePersonInDatabase } from './api'; // Ensure this function is defined in your api file
import { catchError } from '@/common';

type Variables = Omit<PersonType, 'docs'> & { docs: File[] | null };
type Response = void;

export const useCreatePerson = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => createPerson(variables),
  onError: (err) => catchError(err),
});

export const useUpdatePerson = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => updatePersonInDatabase(variables.id, variables), // Pass the ID and updated data
  onError: (err) => catchError(err),
});
export const useDeletePersons = createMutation<Response, number[], AxiosError>({
  mutationFn: async (variables) => deleteMany(variables),
  onError: (err) => catchError(err),
});
