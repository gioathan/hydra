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
import { registerCustomer } from '../../lib/api/auth';
import { saveUser, savePendingUserId } from '../../lib/secureStore';
import { validatePassword, getAxiosErrorMessage } from '../../lib/utils';

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  general?: string;
}

function Field({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize,
  autoComplete, secureTextEntry, showToggle, error,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any; autoCapitalize?: any;
  autoComplete?: any; secureTextEntry?: boolean; showToggle?: boolean; error?: string;
}) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  return (
    <View style={field.group}>
      <Text style={field.label}>{label}</Text>
      <View style={field.row}>
        <TextInput
          style={field.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.outline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={showToggle ? hidden : secureTextEntry}
        />
        {showToggle && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <MaterialIcons
              name={hidden ? 'visibility' : 'visibility-off'}
              size={20}
              color={Colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={field.error}>{error}</Text>}
    </View>
  );
}

const field = StyleSheet.create({
  group: { gap: 6, marginBottom: 20, width: '100%' },
  label: { ...T.labelCaps, color: Colors.onSurfaceVariant },
  row: {
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
  input: { ...T.bodyMd, color: Colors.onSurface, flex: 1, padding: 0 },
  error: { ...T.labelCaps, fontSize: 10, color: Colors.error, letterSpacing: 0, textTransform: 'none', marginTop: 2 },
});

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: () =>
      registerCustomer({ name: name.trim(), email: email.trim(), phone: phone.trim(), password }),
    onSuccess: async (data) => {
      await saveUser(data.user);
      await savePendingUserId(data.user.id);
      router.push({
        pathname: '/(auth)/verify-email',
        params: { userId: data.user.id, email: data.user.email },
      });
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
              <MaterialIcons name="person" size={28} color={Colors.primary} />
            </View>

            <Text style={styles.title}>Join Us</Text>
            <Text style={styles.subtitle}>Experience the heritage of Hydra through exclusive access.</Text>

            <Field label="FULL NAME" value={name} onChangeText={setName}
              placeholder="Alexandros Papadopoulos" autoCapitalize="words" error={errors.name} />
            <Field label="EMAIL" value={email} onChangeText={setEmail}
              placeholder="alex@example.com" keyboardType="email-address" autoCapitalize="none"
              autoComplete="email" error={errors.email} />
            <Field label="PHONE" value={phone} onChangeText={setPhone}
              placeholder="+30 690 000 0000" keyboardType="phone-pad" error={errors.phone} />
            <Field label="PASSWORD" value={password} onChangeText={setPassword}
              placeholder="••••••••" secureTextEntry showToggle error={errors.password} />

            {errors.general && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              onPress={handleRegister}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? <ActivityIndicator size="small" color={Colors.onPrimary} />
                : <Text style={styles.submitLabel}>Create Account</Text>
              }
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
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
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
