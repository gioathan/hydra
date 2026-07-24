import axios from 'axios';
import { getToken, clearAll } from './secureStore';
import { router } from 'expo-router';
import { useAuthStore } from './store/authStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

if (!process.env.EXPO_PUBLIC_API_URL && __DEV__) {
  console.warn(
    '[Local Bee] EXPO_PUBLIC_API_URL is not set in .env. ' +
    'Falling back to localhost which will NOT work on a physical device. ' +
    'Create a .env file with your machine\'s local network IP.'
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.log(`[API] ERROR ${error.config?.url} — ${error.message}`);
    const hadToken = !!error.config?.headers?.Authorization;
    if (
      error.response?.status === 401 &&
      hadToken &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?.url?.includes('/auth/google')
    ) {
      // Only treat this as "your session expired" when a token was actually sent.
      // Discover/venues/events are browsable while logged out, so an anonymous
      // request 401ing on some secondary/optional call must not force-navigate
      // the user away from a page they're allowed to be on.
      useAuthStore.getState().clearAuth();
      await clearAll();
      router.replace('/(auth)');
    }
    return Promise.reject(error);
  }
);
