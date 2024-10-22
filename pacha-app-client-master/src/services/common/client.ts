import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Env from '@env';
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from '@/store';
import { UserAuth } from '../auth';
export const client = axios.create({
  baseURL: Env.VITE_API_URL,
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  async (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the response status is 401 (Unauthorized) and if it's the original request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Refresh the token using an API endpoint
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.get<UserAuth>(
            `${Env.VITE_API_URL}/auth/refresh`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const { access_token, refresh_token } = response.data.tokens;

          // Update the access token in the local storage and the Axios client headers
          setTokens(access_token, refresh_token);
          client.defaults.headers['Authorization'] = `Bearer ${access_token}`;

          // Retry the original request with the updated access token
          return client(originalRequest);
        } catch (refreshError) {
          // Handle the refresh token request error (e.g., log out the user)
          removeTokens();
          console.warn('Error refreshing token:', refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
