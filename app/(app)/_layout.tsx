import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../lib/store/authStore';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

function TabIcon({
  focused,
  label,
  icon,
}: {
  focused: boolean;
  label: string;
  icon: IconName;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && <View style={styles.indicator} />}
      <MaterialIcons
        name={icon}
        size={24}
        color={focused ? Colors.secondary : Colors.onSurfaceVariant}
      />
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

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
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Discover" icon="explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Bookings" icon="event-note" />
          ),
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" icon="person" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(251, 248, 252, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + '4D',
    height: 80,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingTop: 4,
    position: 'relative',
    width: 80,
  },
  indicator: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.onSurfaceVariant,
    marginTop: 3,
  },
  labelFocused: {
    color: Colors.secondary,
  },
});
