import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import type { BookingStatus } from '../types';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  Pending: { label: 'Pending', color: Colors.statusPending, bg: Colors.statusPendingBg },
  Confirmed: { label: 'Confirmed', color: Colors.statusConfirmed, bg: Colors.statusConfirmedBg },
  Cancelled: { label: 'Cancelled', color: Colors.statusCancelled, bg: Colors.statusCancelledBg },
  Declined: { label: 'Declined', color: Colors.statusDeclined, bg: Colors.statusDeclinedBg },
};

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text style={[styles.label, { color: config.color }, isSmall ? styles.labelSm : styles.labelMd]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontWeight: '600',
  },
  labelMd: {
    fontSize: 13,
  },
  labelSm: {
    fontSize: 11,
  },
});
