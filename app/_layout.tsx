import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../lib/store/authStore';
import { getToken, getUser, getCustomerId } from '../lib/secureStore';
import type { UserDto } from '../types';
import { setupNotificationResponseListener } from '../lib/notifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
    },
  },
});

function AuthRehydrator() {
  const { setAuth, setRehydrated } = useAuthStore();

  useEffect(() => {
    async function rehydrate() {
      const token = await getToken();
      const user = await getUser<UserDto>();
      const customerId = await getCustomerId();
      if (token && user && customerId) {
        setAuth(token, user, customerId);
      }
      setRehydrated();
    }
    rehydrate();
  }, []);

  useEffect(() => {
    return setupNotificationResponseListener();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthRehydrator />
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  );
}
