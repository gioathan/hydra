import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { shortId } from '../../../../lib/utils';

export default function SuccessScreen() {
  const { bookingId, venueName } = useLocalSearchParams<{
    id: string;
    bookingId: string;
    venueName: string;
  }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* Check icon */}
        <View style={styles.iconCircle}>
          <MaterialIcons name="check" size={44} color={Colors.statusConfirmed} />
        </View>

        <Text style={styles.title}>Booking Requested!</Text>
        <Text style={styles.subtitle}>
          Your booking at {venueName} has been submitted and is pending confirmation.
        </Text>

        {/* Reference number */}
        {bookingId && (
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.refValue}>#{shortId(bookingId)}</Text>
          </View>
        )}

        {/* Notification note */}
        <View style={styles.note}>
          <MaterialIcons name="notifications-none" size={18} color={Colors.onSurfaceVariant} />
          <Text style={styles.noteText}>
            You'll be notified when the venue confirms your booking.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="View My Bookings"
            onPress={() => router.replace('/(app)/bookings')}
          />
          <PrimaryButton
            title="Back to Home"
            onPress={() => router.replace('/(app)')}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 0,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.statusConfirmedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    ...T.headlineMd,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...T.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  refCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  refLabel: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  refValue: {
    ...T.headlineMd,
    fontSize: 24,
    color: Colors.primary,
    letterSpacing: 2,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 10,
    padding: 14,
    marginBottom: 32,
    width: '100%',
  },
  noteText: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
