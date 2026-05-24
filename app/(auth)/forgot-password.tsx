import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  SafeAreaView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { forgotPassword } from '../../lib/api/auth';
import { getAxiosErrorMessage } from '../../lib/utils';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [_trap, setTrap] = useState('');

  const mutation = useMutation({
    mutationFn: () => forgotPassword({ email: email.trim() }),
    onSuccess: () => {
      router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim() } });
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Something went wrong. Please try again.'));
    },
  });

  const handleSubmit = () => {
    if (_trap) return;
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    mutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerBrand}>HYDRA</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Card */}
          <View style={styles.card}>

            {/* Icon */}
            <View style={styles.iconCircle}>
              <MaterialIcons name="lock-reset" size={28} color={Colors.primary} />
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we&apos;ll send you a 6-digit code to reset your password.
            </Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.outline}
                />
              </View>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TextInput style={styles.trap} value={_trap} onChangeText={setTrap} autoComplete="off" importantForAutofill="no" />

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleSubmit}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                : <Text style={styles.submitLabel}>Send Reset Code</Text>
              }
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign in</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(251,248,252,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerBrand: {
    ...T.displayLg,
    fontSize: 22,
    letterSpacing: 8,
    color: Colors.primary,
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
  trap: { position: 'absolute', left: -9999, top: -9999, height: 0, opacity: 0 },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  footerLink: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: 'PlusJakartaSans_700Bold',
    textDecorationLine: 'underline',
  },
});
