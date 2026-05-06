import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/colors';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  showToggle?: boolean;
}

export function InputField({ label, error, showToggle, secureTextEntry, style, ...rest }: InputFieldProps) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : styles.inputDefault]}>
        <TextInput
          {...rest}
          secureTextEntry={showToggle ? hidden : secureTextEntry}
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
        />
        {showToggle && (
          <Pressable onPress={() => setHidden((h) => !h)} style={styles.toggle}>
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
  },
  inputDefault: {
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  toggle: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 5,
  },
});
