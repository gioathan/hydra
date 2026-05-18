import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (char: string, index: number) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const chars = value.padEnd(length, ' ').split('');
    chars[index] = digit || ' ';
    const next = chars.join('').trimEnd().slice(0, length);
    onChange(next);
    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      const chars = value.padEnd(length, ' ').split('');
      chars[index - 1] = ' ';
      onChange(chars.join('').trimEnd());
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          style={[styles.box, !!value[i] && styles.boxFilled]}
          value={value[i] ?? ''}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={(char) => handleChange(char, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
    textAlign: 'center',
    ...T.headlineMd,
    fontSize: 22,
    color: Colors.onSurface,
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainerLowest,
  },
});
