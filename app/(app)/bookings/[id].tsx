import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../../constants/colors';
import { StatusBadge } from '../../../components/StatusBadge';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { getBooking, cancelBooking } from '../../../lib/api/bookings';
import { getVenue } from '../../../lib/api/venues';
import { formatLocalDate, formatLocalTime, shortId, getAxiosErrorMessage } from '../../../lib/utils';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });

  const { data: venue } = useQuery({
    queryKey: ['venue', booking?.venueId],
    queryFn: () => getVenue(booking!.venueId),
    enabled: !!booking?.venueId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(id, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowCancelModal(false);
    },
    onError: (err) => {
      setCancelError(getAxiosErrorMessage(err, 'Could not cancel booking.'));
    },
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.errorText}>Booking not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';
  const isInactive = booking.status === 'Cancelled' || booking.status === 'Declined';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Booking Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Venue + status header */}
        <View style={[styles.heroCard, isInactive && styles.heroCardInactive]}>
          <Text style={[styles.heroVenueName, isInactive && styles.heroVenueNameInactive]}>
            {venue?.name ?? '…'}
          </Text>
          <StatusBadge status={booking.status} />
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reference</Text>
            <Text style={styles.rowValue}>#{shortId(booking.id)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{formatLocalDate(booking.startUtc)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>{formatLocalTime(booking.startUtc)}</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Guests</Text>
            <Text style={styles.rowValue}>{booking.partySize}</Text>
          </View>
        </View>

        {/* Venue card */}
        {venue && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Venue</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Name</Text>
              <Text style={styles.rowValue}>{venue.name}</Text>
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>Address</Text>
              <Text style={styles.rowValue}>{venue.address}</Text>
            </View>
          </View>
        )}

        {cancelError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{cancelError}</Text>
          </View>
        )}

        {canCancel && (
          <PrimaryButton
            title="Cancel Booking"
            onPress={() => setShowCancelModal(true)}
            variant="danger"
            style={styles.cancelBtn}
          />
        )}
      </ScrollView>

      {/* Cancel confirmation modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCancelModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Cancel Booking?</Text>
                <Text style={styles.modalMessage}>
                  This will cancel your booking at {venue?.name ?? 'this venue'}. This action cannot be undone.
                </Text>
                <PrimaryButton
                  title="Yes, Cancel Booking"
                  onPress={() => cancelMutation.mutate()}
                  loading={cancelMutation.isPending}
                  variant="danger"
                  style={styles.modalBtn}
                />
                <PrimaryButton
                  title="Keep Booking"
                  onPress={() => setShowCancelModal(false)}
                  variant="outline"
                  style={styles.modalBtn}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  heroCard: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  heroCardInactive: {
    backgroundColor: Colors.surface,
  },
  heroVenueName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.3,
  },
  heroVenueNameInactive: {
    color: Colors.textSecondary,
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
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
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
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
  },
  cancelBtn: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 8,
  },
  modalBtn: {},
});
