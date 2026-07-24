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
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Avatar } from '../../../../components/Avatar';
import { createBooking } from '../../../../lib/api/bookings';
import { getCustomer } from '../../../../lib/api/customers';
import { useAuthStore } from '../../../../lib/store/authStore';
import { formatLocalDate, formatLocalTime, getAxiosErrorMessage } from '../../../../lib/utils';
import { RequireAuth } from '../../../../components/RequireAuth';

export default function ConfirmScreen() {
  return (
    <RequireAuth>
      <ConfirmScreenContent />
    </RequireAuth>
  );
}

function ConfirmScreenContent() {
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Booking summary */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>BOOKING SUMMARY</Text>

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

        {/* Customer details */}
        {customer && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>YOUR DETAILS</Text>
            <View style={styles.customerRow}>
              <Avatar name={customer.name} size={44} fontSize={18} />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name ?? '—'}</Text>
                <Text style={styles.customerMeta}>{customer.email ?? customer.phone ?? '—'}</Text>
              </View>
            </View>
            {customer.phone && customer.email && (
              <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.rowLabel}>Phone</Text>
                <Text style={styles.rowValue}>{customer.phone}</Text>
              </View>
            )}
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.termsText}>
          By confirming, you agree to the venue's booking policy. Cancellations can be made from My Bookings.
        </Text>
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
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...T.titleSm,
    fontSize: 17,
    color: Colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    ...T.labelCaps,
    color: Colors.secondary,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + '4D',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  rowValue: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  customerInfo: { flex: 1 },
  customerName: {
    ...T.titleSm,
    fontSize: 15,
    color: Colors.primary,
  },
  customerMeta: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.errorContainer,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  termsText: {
    ...T.bodyMd,
    fontSize: 12,
    color: Colors.outline,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
});
