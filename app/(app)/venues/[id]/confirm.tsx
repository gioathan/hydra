import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Colors } from '../../../../constants/colors';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Avatar } from '../../../../components/Avatar';
import { createBooking } from '../../../../lib/api/bookings';
import { getCustomer } from '../../../../lib/api/customers';
import { useAuthStore } from '../../../../lib/store/authStore';
import { formatLocalDate, formatLocalTime, getAxiosErrorMessage } from '../../../../lib/utils';

export default function ConfirmScreen() {
  const { id, venueName, date, partySize, startUtc, endUtc } =
    useLocalSearchParams<{
      id: string;
      venueName: string;
      date: string;
      partySize: string;
      startUtc: string;
      endUtc: string;
    }>();

  const { customerId } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId!),
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createBooking({
        venueId: id,
        customerId: customerId!,
        startUtc: startUtc,
        endUtc: endUtc,
        partySize: parseInt(partySize, 10),
      }),
    onSuccess: (booking) => {
      router.replace({
        pathname: '/(app)/venues/[id]/success',
        params: { id, bookingId: booking.id, venueName },
      });
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Could not create booking. Please try again.'));
    },
  });

  if (customerLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Booking Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Summary</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Venue</Text>
            <Text style={styles.rowValue}>{venueName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{formatLocalDate(startUtc)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>{formatLocalTime(startUtc)}</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Guests</Text>
            <Text style={styles.rowValue}>{partySize}</Text>
          </View>
        </View>

        {/* Customer Details */}
        {customer && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Details</Text>
            <View style={styles.customerRow}>
              <Avatar name={customer.name} size={44} fontSize={18} />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name ?? '—'}</Text>
                <Text style={styles.customerMeta}>{customer.email ?? customer.phone ?? '—'}</Text>
              </View>
            </View>
            {customer.phone && customer.email && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Phone</Text>
                <Text style={styles.rowValue}>{customer.phone}</Text>
              </View>
            )}
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.termsNote}>
          <Text style={styles.termsText}>
            By confirming, you agree to the venue's booking policy. Cancellations can be made from My Bookings.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Confirm Booking"
          onPress={() => mutation.mutate()}
          loading={mutation.isPending}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: Colors.navy,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  customerMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  termsNote: {
    padding: 12,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
});
