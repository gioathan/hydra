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
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { StatusBadge } from '../../../../components/StatusBadge';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { getBooking, cancelBooking } from '../../../../lib/api/bookings';
import { getVenue } from '../../../../lib/api/venues';
import { formatLocalDate, formatLocalTime, shortId, getAxiosErrorMessage } from '../../../../lib/utils';

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
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>Booking not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canCancel = booking.status === 'Pending' || booking.status === 'Confirmed';
  const isInactive = booking.status === 'Cancelled' || booking.status === 'Declined';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Booking Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero card */}
        <View style={[styles.heroCard, isInactive && styles.heroCardInactive]}>
          <Text style={[styles.heroVenueName, isInactive && styles.heroVenueNameInactive]}>
            {venue?.name ?? '…'}
          </Text>
          <StatusBadge status={booking.status} />
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DETAILS</Text>
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
            <Text style={styles.cardLabel}>VENUE</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Name</Text>
              <Text style={styles.rowValue}>{venue.name}</Text>
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>Address</Text>
              <Text style={[styles.rowValue, styles.rowValueSmall]}>{venue.address}</Text>
            </View>
          </View>
        )}

        {booking.venueComment && (
          <View style={styles.commentCard}>
            <MaterialIcons name="chat-bubble-outline" size={18} color={Colors.statusPending} style={{ marginTop: 1 }} />
            <View style={styles.commentBody}>
              <Text style={styles.commentLabel}>MESSAGE FROM {(venue?.name ?? 'VENUE').toUpperCase()}</Text>
              <Text style={styles.commentText}>{booking.venueComment}</Text>
            </View>
          </View>
        )}

        {cancelError && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={16} color={Colors.error} />
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
                />
                <PrimaryButton
                  title="Keep Booking"
                  onPress={() => setShowCancelModal(false)}
                  variant="outline"
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
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  heroCardInactive: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  heroVenueName: {
    ...T.headlineMd,
    fontSize: 22,
    color: Colors.onPrimary,
  },
  heroVenueNameInactive: {
    color: Colors.onSurfaceVariant,
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
    marginBottom: 12,
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
  rowValueSmall: {
    fontSize: 13,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.statusPendingBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentLabel: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.statusPending,
    marginBottom: 4,
  },
  commentText: {
    ...T.bodyMd,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 22,
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
  cancelBtn: {
    marginTop: 4,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalTitle: {
    ...T.headlineMd,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 4,
  },
  modalMessage: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 8,
  },
});
