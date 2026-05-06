import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1.5,
  },
  chipDefault: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelDefault: {
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.textInverse,
  },
});
