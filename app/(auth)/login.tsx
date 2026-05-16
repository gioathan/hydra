import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { login } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/authStore';
import { saveToken, saveUser, saveCustomerId } from '../../lib/secureStore';
import { registerForPushNotifications } from '../../lib/notifications';
import { getAxiosErrorMessage } from '../../lib/utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => login({ email: email.trim(), password }),
    onSuccess: async (data) => {
      if (!data.customerId) {
        setError('No customer account associated with this user.');
        return;
      }
      await saveToken(data.token);
      await saveUser(data.user);
      await saveCustomerId(data.customerId);
      setAuth(data.token, data.user, data.customerId);
      await registerForPushNotifications(data.customerId);
      router.replace('/(app)');
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Invalid email or password.'));
    },
  });

  const handleLogin = () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    mutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Fixed header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerBrand}>HYDRA</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Please sign in to access your curated island experience.
            </Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="guest@aegean.com"
                  placeholderTextColor={Colors.outlineVariant}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Text style={styles.forgotLink}>Forgot?</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  placeholderTextColor={Colors.outlineVariant}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={Colors.onSurfaceVariant}
                  />
                </Pressable>
              </View>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleLogin}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator size="small" color={Colors.onPrimary} />
              ) : (
                <Text style={styles.submitLabel}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
              <Text style={styles.footerLink}>Create account</Text>
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
  flex: { flex: 1 },
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
    ...T.displayLg,
    fontSize: 24,
    letterSpacing: 8,
    color: Colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    ...T.headlineMd,
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
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
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
    marginLeft: 4,
  },
  forgotLink: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.secondaryContainer,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    ...T.bodyMd,
    color: Colors.onSurface,
    flex: 1,
  },
  errorBox: {
    backgroundColor: Colors.errorContainer,
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    ...T.labelCaps,
    color: Colors.onErrorContainer,
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
  submitLabel: {
    ...T.buttonText,
    color: Colors.onPrimary,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
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
