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
import { Colors } from '../../../constants/colors';
import { InputField } from '../../../components/InputField';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { updatePassword } from '../../../lib/api/users';
import { useAuthStore } from '../../../lib/store/authStore';
import { validatePassword, getAxiosErrorMessage } from '../../../lib/utils';

export default function ChangePasswordScreen() {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      updatePassword(user!.id, { currentPassword, newPassword }),
    onSuccess: () => {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setTimeout(() => {
        setSuccess(false);
        router.back();
      }, 2000);
    },
    onError: (err) => {
      setErrors({ general: getAxiosErrorMessage(err, 'Could not update password.') });
    },
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.current = 'Current password is required.';
    const pwErr = validatePassword(newPassword);
    if (pwErr) errs.new = pwErr;
    if (newPassword !== confirmPassword) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    setErrors({});
    setSuccess(false);
    if (validate()) mutation.mutate();
  };

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
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <InputField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            showToggle
            secureTextEntry
            error={errors.current}
            placeholder="Enter current password"
          />
          <InputField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            showToggle
            secureTextEntry
            error={errors.new}
            placeholder="Min 10 chars, upper, digit, special"
          />
          <InputField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showToggle
            secureTextEntry
            error={errors.confirm}
            placeholder="Repeat new password"
          />

          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              Password must be at least 10 characters with an uppercase letter, a digit, and a special character.
            </Text>
          </View>

          {success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>Password changed! Redirecting…</Text>
            </View>
          )}

          {errors.general && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          <PrimaryButton
            title="Save New Password"
            onPress={handleSave}
            loading={mutation.isPending}
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
  hintBox: {
    backgroundColor: Colors.overlayLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    marginTop: -4,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
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
});
