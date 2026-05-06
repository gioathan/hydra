import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../lib/store/authStore';

function TabIcon({ focused, label, icon }: { focused: boolean; label: string; icon: string }) {
  return (
    <View style={tabStyles.iconWrapper}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>{icon}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    paddingTop: 6,
  },
  icon: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  iconFocused: {
    color: Colors.navy,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
  },
  labelFocused: {
    color: Colors.navy,
  },
});

export default function AppLayout() {
  const { token, isRehydrated } = useAuthStore();

  useEffect(() => {
    if (isRehydrated && !token) {
      router.replace('/(auth)');
    }
  }, [token, isRehydrated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Discover" icon="🏛️" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Bookings" icon="📋" />
          ),
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" icon="👤" />
          ),
        }}
      />
    </Tabs>
  );
}
