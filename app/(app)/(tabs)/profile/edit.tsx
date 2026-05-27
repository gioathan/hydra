import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../../../constants/colors';
import { InputField } from '../../../../components/InputField';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { getCustomer, updateCustomer } from '../../../../lib/api/customers';
import { useAuthStore } from '../../../../lib/store/authStore';
import { getAxiosErrorMessage } from '../../../../lib/utils';

export default function EditProfileScreen() {
  const { customerId } = useAuthStore();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId!),
    enabled: !!customerId,
  });

  useEffect(() => {
    if (customer) {
      setName(customer.name ?? '');
      setPhone(customer.phone ?? '');
    }
  }, [customer]);

  const mutation = useMutation({
    mutationFn: () =>
      updateCustomer(customerId!, {
        name: name.trim() || null,
        phone: phone.trim() || null,
        email: customer?.email ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Could not update profile.'));
    },
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="Your name"
          />
          <InputField
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+30 210 000 0000"
          />

          {success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>Profile updated successfully!</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <PrimaryButton
            title="Save Changes"
            onPress={() => mutation.mutate()}
            loading={mutation.isPending}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: Colors.navy,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successBox: {
    backgroundColor: Colors.successBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
  },
  saveBtn: {},
});
