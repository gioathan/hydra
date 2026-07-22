import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  SafeAreaView, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
let GoogleSignin: any = null;
let statusCodes: any = {};
try {
  const mod = require('@react-native-google-signin/google-signin');
  GoogleSignin = mod.GoogleSignin;
  statusCodes = mod.statusCodes;
} catch {
  // Native module unavailable in Expo Go — Google Sign-In disabled
}
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { login, googleLogin } from '../../lib/api/auth';
import { useAuthStore } from '../../lib/store/authStore';
import { saveToken, saveUser, saveCustomerId, getPendingUserId } from '../../lib/secureStore';
import { registerForPushNotifications } from '../../lib/notifications';
import { getAxiosErrorMessage } from '../../lib/utils';

function GoogleIcon() {
  const { FontAwesome5 } = require('@expo/vector-icons');
  return <FontAwesome5 name="google" size={18} color="#4285F4" />;
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_trap, setTrap] = useState('');
  const { setAuth } = useAuthStore();

  const handleAuthSuccess = async (data: { token: string; user: any; customerId: string | null; phoneRequired?: boolean }) => {
    if (!data.customerId) {
      setError('No customer account associated with this user.');
      return;
    }
    await saveToken(data.token);
    await saveUser(data.user);
    await saveCustomerId(data.customerId);
    setAuth(data.token, data.user, data.customerId);
    await registerForPushNotifications(data.customerId);
    router.replace(data.phoneRequired ? '/(app)/complete-profile' : '/(app)');
  };

  const mutation = useMutation({
    mutationFn: () => login({ email: email.trim(), password }),
    onSuccess: handleAuthSuccess,
    onError: async (err: any) => {
      if (err?.response?.status === 403) {
        const userId = err?.response?.data?.userId ?? await getPendingUserId() ?? '';
        router.push({
          pathname: '/(auth)/verify-email',
          params: { userId, email: email.trim() },
        });
        return;
      }
      setError(getAxiosErrorMessage(err, 'Invalid email or password.'));
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      if (!GoogleSignin) throw new Error('Google Sign-In is not available in Expo Go. Use a development build.');
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.type === 'cancelled') {
        const err: any = new Error('cancelled');
        err.code = statusCodes.SIGN_IN_CANCELLED;
        throw err;
      }
      const idToken = response.data?.idToken;
      if (!idToken) throw new Error('Could not retrieve Google ID token.');
      return googleLogin({ idToken });
    },
    onSuccess: handleAuthSuccess,
    onError: (err: any) => {
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err?.code === statusCodes.IN_PROGRESS) return;
      if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services are not available on this device.');
        return;
      }
      setError(getAxiosErrorMessage(err, 'Google sign-in failed. Please try again.'));
    },
  });

  const handleLogin = () => {
    if (_trap) return;
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    mutation.mutate();
  };

  const anyPending = mutation.isPending || googleMutation.isPending;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
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

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Card */}
          <View style={styles.card}>

            {/* Icon */}
            <View style={styles.iconCircle}>
              <MaterialIcons name="calendar-today" size={26} color={Colors.primary} />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account.</Text>

            {/* Google sign-in button */}
            <Pressable
              style={({ pressed }) => [styles.googleBtn, pressed && styles.pressed, anyPending && styles.disabled]}
              onPress={() => { setError(null); googleMutation.mutate(); }}
              disabled={anyPending || !GoogleSignin}
            >
              {googleMutation.isPending ? (
                <ActivityIndicator size="small" color={Colors.onSurfaceVariant} />
              ) : (
                <>
                  <GoogleIcon />
                  <Text style={styles.googleLabel}>Continue with Google</Text>
                </>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

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

            {/* Password */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')} hitSlop={8}>
                  <Text style={styles.forgotLink}>Forgot?</Text>
                </Pressable>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  placeholderTextColor={Colors.outline}
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
              error.includes('Google Sign-In') ? (
                <View style={styles.googleHintBox}>
                  <Text style={styles.googleHintText}>↑ This account was registered with Google. Use the "Continue with Google" button above.</Text>
                </View>
              ) : (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )
            )}

            <TextInput style={styles.trap} value={_trap} onChangeText={setTrap} autoComplete="off" importantForAutofill="no" />

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed, anyPending && styles.disabled]}
              onPress={handleLogin}
              disabled={anyPending}
            >
              {mutation.isPending
                ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                : <Text style={styles.submitLabel}>Sign In</Text>
              }
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
    gap: 0,
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
    marginBottom: 24,
  },
  googleBtn: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    marginBottom: 20,
  },
  googleLabel: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurface,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
  },
  dividerText: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  fieldGroup: {
    width: '100%',
    gap: 6,
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  forgotLink: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.secondary,
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
  googleHintBox: {
    width: '100%',
    backgroundColor: '#FBF2EC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.secondary + '33',
  },
  googleHintText: {
    ...T.labelCaps,
    color: Colors.secondary,
    letterSpacing: 0,
    textTransform: 'none',
  },
  disabled: { opacity: 0.65 },
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
