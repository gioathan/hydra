import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipDefault,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
  },
  chipDefault: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.outlineVariant + '66',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: { ...T.buttonText, fontSize: 14 },
  labelDefault: { color: Colors.onSurfaceVariant },
  labelSelected: { color: Colors.onPrimary },
  pressed: { opacity: 0.8 },
});
