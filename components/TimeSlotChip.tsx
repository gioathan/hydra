import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { formatLocalTime } from '../lib/utils';
import type { AvailabilitySlot } from '../types';

interface TimeSlotChipProps {
  slot: AvailabilitySlot;
  selected: boolean;
  onPress: () => void;
}

export function TimeSlotChip({ slot, selected, onPress }: TimeSlotChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.selected : styles.default]}
    >
      <Text style={[styles.time, selected ? styles.timeSelected : styles.timeDefault]}>
        {formatLocalTime(slot.startUtc)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 90,
    alignItems: 'center',
    margin: 5,
  },
  default: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  selected: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeDefault: {
    color: Colors.textPrimary,
  },
  timeSelected: {
    color: Colors.textInverse,
  },
});
