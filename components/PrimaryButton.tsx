import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, PressableProps } from 'react-native';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';

interface PrimaryButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
}

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  style,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style as object,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.onPrimary : Colors.primary}
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(251,248,252,0.4)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.error + '33',
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { ...T.buttonText },
  primaryLabel: { color: Colors.onPrimary },
  ghostLabel: { color: Colors.surfaceBright },
  outlineLabel: { color: Colors.primary },
  dangerLabel: { color: Colors.error },
});
