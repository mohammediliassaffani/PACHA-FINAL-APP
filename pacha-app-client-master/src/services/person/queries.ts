import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { getPeople } from './api';
import { queryKey } from './query-keys';
import queryString from 'query-string';
import { PersonType } from './schema';

type Variables = queryString.ParsedQuery<string>;
type Response = { people: PersonType[]; totalPages: number };

export const useGetPeopel = createQuery<Response, Variables, AxiosError>({
  queryKey: queryKey.getPeople,
  fetcher: (variables) => getPeople(variables),
});
