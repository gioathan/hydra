import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { Avatar } from '../../../../components/Avatar';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { getCustomer } from '../../../../lib/api/customers';
import { deleteUser } from '../../../../lib/api/users';
import { useAuthStore } from '../../../../lib/store/authStore';
import { clearAll } from '../../../../lib/secureStore';
import { unregisterPushNotifications } from '../../../../lib/notifications';
import { getAxiosErrorMessage } from '../../../../lib/utils';

let GoogleSignin: any = null;
try { GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin; } catch {}

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface MenuRowProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuRow({ icon, label, onPress, destructive }: MenuRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
      onPress={onPress}
    >
      <View style={styles.menuRowLeft}>
        <View style={[styles.menuIconContainer, destructive && styles.menuIconContainerDestructive]}>
          <MaterialIcons
            name={icon}
            size={20}
            color={destructive ? Colors.error : Colors.primary}
          />
        </View>
        <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
      </View>
      {!destructive && (
        <MaterialIcons name="chevron-right" size={20} color={Colors.outline} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, customerId, clearAuth } = useAuthStore();
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
          if (customerId) await unregisterPushNotifications(customerId);
          try { if (GoogleSignin) await GoogleSignin.signOut(); } catch {}
          clearAuth();
          await clearAll();
          queryClient.clear();
          router.replace('/(auth)');
        },
      },
    ]);
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user!.id),
    onSuccess: async () => {
      try { if (GoogleSignin) await GoogleSignin.signOut(); } catch {}
      clearAuth();
      await clearAll();
      queryClient.clear();
      router.replace('/(auth)');
    },
    onError: (err) => {
      Alert.alert('Something went wrong', getAxiosErrorMessage(err, 'Could not delete your account. Please try again.'));
    },
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This permanently deletes your account, bookings, and ratings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View style={styles.hero}>
          <Avatar name={customer?.name} size={84} fontSize={34} />
          <Text style={styles.customerName}>{customer?.name ?? '—'}</Text>
          <Text style={styles.customerEmail}>{customer?.email ?? customer?.phone ?? '—'}</Text>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="edit"
              label="Edit Profile"
              onPress={() => router.push('/(app)/profile/edit')}
            />
            <View style={styles.separator} />
            <MenuRow
              icon="lock-outline"
              label="Change Password"
              onPress={() => router.push('/(app)/profile/password')}
            />
          </View>
        </View>

        {/* Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BOOKINGS</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="event-note"
              label="My Bookings"
              onPress={() => router.push('/(app)/bookings')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="mail-outline"
              label="Contact Us"
              onPress={() => Linking.openURL('mailto:test@email.com')}
            />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL</Text>
          <View style={styles.menuGroup}>
            <MenuRow
              icon="privacy-tip"
              label="Privacy Policy"
              onPress={() => router.push('/(app)/profile/privacy-policy' as any)}
            />
            <View style={styles.separator} />
            <MenuRow
              icon="description"
              label="Terms of Service"
              onPress={() => router.push('/(app)/profile/terms-of-service' as any)}
            />
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuRow icon="exit-to-app" label="Sign Out" onPress={handleSignOut} destructive />
          </View>
        </View>

        {/* Delete account */}
        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuRow icon="delete-forever" label="Delete Account" onPress={handleDeleteAccount} destructive />
          </View>
        </View>

        <Text style={styles.version}>Local Bee v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    marginBottom: 8,
    gap: 6,
  },
  customerName: {
    ...T.titleSm,
    color: Colors.primary,
    marginTop: 8,
  },
  customerEmail: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuRowPressed: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.primaryContainer + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconContainerDestructive: {
    backgroundColor: Colors.errorContainer,
  },
  menuLabel: {
    ...T.bodyMd,
    fontSize: 15,
    color: Colors.primary,
  },
  menuLabelDestructive: {
    color: Colors.error,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
    marginLeft: 64,
  },
  version: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.outline,
    textAlign: 'center',
    marginTop: 36,
    letterSpacing: 1,
  },
});
