import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../../constants/colors';
import { Avatar } from '../../../components/Avatar';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { getCustomer } from '../../../lib/api/customers';
import { useAuthStore } from '../../../lib/store/authStore';
import { clearAll } from '../../../lib/secureStore';
import { unregisterPushNotifications } from '../../../lib/notifications';

interface MenuRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuRow({ icon, label, onPress, destructive }: MenuRowProps) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuRowLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
      </View>
      {!destructive && <Text style={styles.menuChevron}>›</Text>}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { customerId, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId!),
    enabled: !!customerId,
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          if (customerId) {
            await unregisterPushNotifications(customerId);
          }
          clearAuth();
          await clearAll();
          queryClient.clear();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Profile hero */}
        <View style={styles.profileHero}>
          <Avatar name={customer?.name} size={80} fontSize={32} />
          <Text style={styles.customerName}>{customer?.name ?? '—'}</Text>
          <Text style={styles.customerEmail}>{customer?.email ?? customer?.phone ?? '—'}</Text>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="✏️"
              label="Edit Profile"
              onPress={() => router.push('/(app)/profile/edit')}
            />
            <View style={styles.separator} />
            <MenuRow
              icon="🔒"
              label="Change Password"
              onPress={() => router.push('/(app)/profile/password')}
            />
          </View>
        </View>

        {/* Bookings shortcut */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookings</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="📋"
              label="My Bookings"
              onPress={() => router.push('/(app)/bookings')}
            />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuRow icon="🚪" label="Sign Out" onPress={handleSignOut} destructive />
          </View>
        </View>

        <Text style={styles.version}>Hydra v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 14,
    letterSpacing: -0.3,
  },
  customerEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuLabelDestructive: {
    color: Colors.error,
  },
  menuChevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 52,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 32,
  },
});
