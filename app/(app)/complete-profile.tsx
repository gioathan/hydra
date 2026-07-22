import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { updateCustomer } from '../../lib/api/customers';
import { useAuthStore } from '../../lib/store/authStore';
import { getAxiosErrorMessage } from '../../lib/utils';

export default function CompleteProfileScreen() {
  const { customerId } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      updateCustomer(customerId!, { email: null, name: null, locale: 'en', phone: phone.trim() }),
    onSuccess: () => router.replace('/(app)'),
    onError: (err) => setError(getAxiosErrorMessage(err, 'Something went wrong. Please try again.')),
  });

  const handleSubmit = () => {
    setError(null);
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    mutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/brand-mark.png')}
            style={styles.headerBrand}
          />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Card */}
          <View style={styles.card}>

            {/* Icon */}
            <View style={styles.iconCircle}>
              <MaterialIcons name="phone-iphone" size={28} color={Colors.primary} />
            </View>

            <Text style={styles.title}>One last thing</Text>
            <Text style={styles.subtitle}>
              Add your phone number so venues can reach you about your bookings.
            </Text>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  placeholder="+30 210 000 0000"
                  placeholderTextColor={Colors.outline}
                />
              </View>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleSubmit}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                : <Text style={styles.submitLabel}>Continue</Text>
              }
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(251,248,252,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerBrand: {
    height: 34,
    width: 34 * (1080 / 340),
    resizeMode: 'contain',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...T.headlineMd,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  fieldGroup: {
    width: '100%',
    gap: 6,
    marginBottom: 20,
  },
  fieldLabel: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 2,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  input: {
    ...T.bodyMd,
    color: Colors.onSurface,
    flex: 1,
    padding: 0,
  },
  errorBox: {
    width: '100%',
    backgroundColor: Colors.errorContainer,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    ...T.labelCaps,
    color: Colors.onErrorContainer,
    letterSpacing: 0,
    textTransform: 'none',
  },
  submitBtn: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitLabel: {
    ...T.buttonText,
    color: Colors.onPrimary,
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
