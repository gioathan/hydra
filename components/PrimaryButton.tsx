import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, PressableProps } from 'react-native';
import { Colors } from '../constants/colors';

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
          color={variant === 'primary' || variant === 'danger' ? Colors.textInverse : Colors.navy}
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
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.terracotta,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.textInverse,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.navy,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryLabel: {
    color: Colors.textInverse,
  },
  ghostLabel: {
    color: Colors.textInverse,
  },
  outlineLabel: {
    color: Colors.navy,
  },
  dangerLabel: {
    color: Colors.textInverse,
  },
});
