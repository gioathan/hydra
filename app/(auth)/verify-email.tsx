import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { verifyEmail, resendVerification } from '../../lib/api/auth';
import { clearPendingUserId } from '../../lib/secureStore';
import { OtpInput } from '../../components/OtpInput';
import { getAxiosErrorMessage } from '../../lib/utils';

export default function VerifyEmailScreen() {
  const { userId, email, redirect } = useLocalSearchParams<{ userId: string; email: string; redirect?: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmail({ userId, code }),
    onSuccess: async () => {
      await clearPendingUserId();
      router.replace({ pathname: '/(auth)/login', params: redirect ? { redirect } : {} });
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Invalid or expired code. Please try again.'));
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendVerification({ userId }),
    onSuccess: () => {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Could not resend code. Please try again.'));
    },
  });

  const handleVerify = () => {
    setError(null);
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    verifyMutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Image
          source={require('../../assets/images/brand-mark.png')}
          style={styles.headerBrand}
        />
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <OtpInput value={code} onChange={setCode} />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {resendSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>A new code has been sent to your email.</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
            onPress={handleVerify}
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? (
              <ActivityIndicator size="small" color={Colors.onPrimary} />
            ) : (
              <Text style={styles.submitLabel}>Verify Email</Text>
            )}
          </Pressable>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <Pressable
              onPress={() => { setError(null); resendMutation.mutate(); }}
              disabled={resendMutation.isPending || !userId}
              hitSlop={8}
            >
              {resendMutation.isPending ? (
                <ActivityIndicator size="small" color={Colors.secondary} />
              ) : (
                <Text style={[styles.resendLink, !userId && styles.resendDisabled]}>
                  Resend code
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(251,248,252,0.8)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerBrand: {
    height: 34,
    width: 34 * (1080 / 340),
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleSection: { marginBottom: 32 },
  title: { ...T.headlineMd, color: Colors.primary, marginBottom: 8 },
  subtitle: { ...T.bodyMd, fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22 },
  emailHighlight: { color: Colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '33',
    gap: 24,
  },
  errorBox: { backgroundColor: Colors.errorContainer, borderRadius: 8, padding: 12 },
  errorText: {
    ...T.labelCaps,
    color: Colors.onErrorContainer,
    letterSpacing: 0,
    textTransform: 'none',
  },
  successBox: { backgroundColor: Colors.successBg, borderRadius: 8, padding: 12 },
  successText: {
    ...T.labelCaps,
    color: Colors.success,
    letterSpacing: 0,
    textTransform: 'none',
  },
  submitBtn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitLabel: { ...T.buttonText, color: Colors.onPrimary },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendText: { ...T.bodyMd, fontSize: 14, color: Colors.onSurfaceVariant },
  resendLink: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: 'PlusJakartaSans_700Bold',
    textDecorationLine: 'underline',
  },
  resendDisabled: { opacity: 0.4 },
});
