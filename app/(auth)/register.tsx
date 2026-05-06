import React, { useState } from 'react';
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
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { InputField } from '../../components/InputField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { registerCustomer } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/authStore';
import { saveToken, saveUser, saveCustomerId } from '../../lib/secureStore';
import { registerForPushNotifications } from '../../lib/notifications';
import { validatePassword, getAxiosErrorMessage } from '../../lib/utils';

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  general?: string;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () =>
      registerCustomer({ name: name.trim(), email: email.trim(), phone: phone.trim(), password }),
    onSuccess: async (data) => {
      await saveToken(data.token);
      await saveUser(data.user);
      await saveCustomerId(data.customer.id);
      setAuth(data.token, data.user, data.customer.id);
      await registerForPushNotifications(data.customer.id);
      router.replace('/(app)');
    },
    onError: (err) => {
      setErrors({ general: getAxiosErrorMessage(err, 'Registration failed. Please try again.') });
    },
  });

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'A valid email is required.';
    if (!phone.trim()) errs.phone = 'Phone number is required.';
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = () => {
    setErrors({});
    if (validate()) mutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join Hydra and start booking.</Text>

          <View style={styles.form}>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholder="Maria Papadopoulos"
              error={errors.name}
            />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
            />
            <InputField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+30 210 000 0000"
              error={errors.phone}
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              showToggle
              secureTextEntry
              placeholder="Min 10 chars, upper, digit, special"
              error={errors.password}
            />

            <View style={styles.passwordHint}>
              <Text style={styles.hintText}>
                Password must be 10+ characters with an uppercase letter, a digit, and a special character.
              </Text>
            </View>

            {errors.general && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            <PrimaryButton
              title="Create Account"
              onPress={handleRegister}
              loading={mutation.isPending}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}> Sign in</Text>
            </Pressable>
          </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    flexGrow: 1,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: Colors.navy,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    gap: 0,
  },
  passwordHint: {
    marginTop: -8,
    marginBottom: 16,
    backgroundColor: Colors.overlayLight,
    borderRadius: 8,
    padding: 10,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
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
    fontWeight: '500',
  },
  submitBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.terracotta,
    fontWeight: '700',
  },
});
