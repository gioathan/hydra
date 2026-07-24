import React from 'react';
import { Stack } from 'expo-router';

// Discover/venues/events are browsable without an account — only specific
// screens (bookings, profile, booking confirm/rate) require login, guarded
// individually via RequireAuth rather than gating this whole group.
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="venues" />
      <Stack.Screen name="events" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
