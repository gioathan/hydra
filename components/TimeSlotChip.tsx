import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';
import { formatLocalTime } from '../lib/utils';
import type { AvailabilitySlot } from '../types';

interface TimeSlotChipProps {
  slot: AvailabilitySlot;
  selected: boolean;
  onPress: () => void;
}

export function TimeSlotChip({ slot, selected, onPress }: TimeSlotChipProps) {
  return (
    // Outer view pins width to exactly 1/3 of the grid; padding creates the gap
    <View style={styles.outer}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          selected ? styles.selected : styles.unselected,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.time, selected ? styles.timeSelected : styles.timeDefault]}>
          {formatLocalTime(slot.startUtc)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '33.33%',
    padding: 4,
  },
  chip: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselected: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.outlineVariant,
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  time: {
    ...T.buttonText,
    fontSize: 14,
  },
  timeDefault: { color: Colors.onSurface },
  timeSelected: { color: Colors.onPrimary },
});
