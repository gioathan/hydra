import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';
import { StatusBadge } from './StatusBadge';
import { formatLocalDate, formatLocalTime, shortId } from '../lib/utils';
import type { BookingDto } from '../types';

interface BookingCardProps {
  booking: BookingDto;
  venueName?: string;
  onPress: () => void;
}

export function BookingCard({ booking, venueName, onPress }: BookingCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.venueName} numberOfLines={1}>
          {venueName ?? '…'}
        </Text>
        <StatusBadge status={booking.status} size="sm" />
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <MaterialIcons name="event" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.metaValue}>{formatLocalDate(booking.startUtc)}</Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <MaterialIcons name="schedule" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.metaValue}>{formatLocalTime(booking.startUtc)}</Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <MaterialIcons name="people" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.metaValue}>{booking.partySize}</Text>
        </View>
      </View>

      <Text style={styles.ref}>Ref #{shortId(booking.id)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  venueName: {
    ...T.titleSm,
    fontSize: 16,
    color: Colors.primary,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.outlineVariant,
  },
  metaValue: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  ref: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 0.5,
    textTransform: 'none',
  },
});
