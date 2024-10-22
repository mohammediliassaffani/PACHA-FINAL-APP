import { AuthUserRespondType } from '@/services/auth';
import { create } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';

interface AuthState {
  tokens: { access_token: string; refresh_token: string } | null;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
  user?: AuthUserRespondType;
  setUser: (value: AuthUserRespondType) => void;
  logout: () => void;
}

const persistOptions: PersistOptions<AuthState> = {
  name: 'auth-storage',
  storage: createJSONStorage(() => localStorage),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      setTokens: (tokens) => set({ tokens }),
      setUser: (value) => set({ user: value }),
      logout: () => set({ tokens: undefined, user: undefined }),
    }),
    persistOptions
  )
);

export const getAccessToken = () =>
  useAuthStore.getState().tokens?.access_token;
export const getRefreshToken = () =>
  useAuthStore.getState().tokens?.refresh_token;

export const setTokens = (access_token: string, refresh_token: string) => {
  const user = useAuthStore.getState().user;
  if (user) {
    useAuthStore.getState().setTokens({ access_token, refresh_token });
  }
};

export const removeTokens = () => useAuthStore.getState().logout();
