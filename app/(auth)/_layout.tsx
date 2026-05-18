import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '../../lib/store/authStore';

export default function AuthLayout() {
  const { token, isRehydrated } = useAuthStore();

  useEffect(() => {
    if (isRehydrated && token) {
      router.replace('/(app)');
    }
  }, [token, isRehydrated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
