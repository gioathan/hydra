import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../../../constants/colors';
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
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>Booking Requested!</Text>
        <Text style={styles.subtitle}>
          Your booking at {venueName} has been submitted and is pending confirmation.
        </Text>

        {bookingId && (
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Booking Reference</Text>
            <Text style={styles.refValue}>#{shortId(bookingId)}</Text>
          </View>
        )}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            You'll receive a push notification when the venue confirms or updates your booking.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="View My Bookings"
            onPress={() => router.replace('/(app)/bookings')}
            style={styles.btn}
          />
          <PrimaryButton
            title="Back to Home"
            onPress={() => router.replace('/(app)')}
            variant="outline"
            style={styles.btn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.statusConfirmedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  icon: {
    fontSize: 40,
    color: Colors.statusConfirmed,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  refCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  refLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  refValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.navy,
    letterSpacing: 1,
  },
  note: {
    backgroundColor: Colors.overlayLight,
    borderRadius: 10,
    padding: 14,
    marginBottom: 36,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  btn: {},
});
