import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { hasPassword } from './api';
import { queryKey } from './query-keys';

type Response = boolean;
type Variables = void;

export const useAllHasPassword = createQuery<Response, Variables, AxiosError>({
  queryKey: queryKey.allHasPass,
  fetcher: () => hasPassword(),
  retry: 1,
  refetchOnWindowFocus: false,
});
