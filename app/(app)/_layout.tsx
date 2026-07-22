import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '../../lib/store/authStore';

export default function AppLayout() {
  const { token, isRehydrated } = useAuthStore();

  useEffect(() => {
    if (isRehydrated && !token) {
      router.replace('/(auth)');
    }
  }, [token, isRehydrated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="venues" />
      <Stack.Screen name="events" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
