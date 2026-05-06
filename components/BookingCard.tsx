import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
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
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.venueName} numberOfLines={1}>
          {venueName ?? '…'}
        </Text>
        <StatusBadge status={booking.status} size="sm" />
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{formatLocalDate(booking.startUtc)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Time</Text>
          <Text style={styles.metaValue}>{formatLocalTime(booking.startUtc)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Guests</Text>
          <Text style={styles.metaValue}>{booking.partySize}</Text>
        </View>
      </View>

      <Text style={styles.ref}>Ref #{shortId(booking.id)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ref: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
