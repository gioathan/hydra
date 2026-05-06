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
import { Colors } from '../../../../constants/colors';
import { TimeSlotChip } from '../../../../components/TimeSlotChip';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { formatLocalDate } from '../../../../lib/utils';
import type { AvailabilitySlot } from '../../../../types';

export default function SlotsScreen() {
  const { id, date, partySize, slots, isAvailable, reason, venueName } =
    useLocalSearchParams<{
      id: string;
      date: string;
      partySize: string;
      slots: string;
      isAvailable: string;
      reason: string;
      venueName: string;
    }>();

  const parsedSlots: AvailabilitySlot[] = JSON.parse(slots ?? '[]');
  const available = isAvailable === 'true';
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const displayDate = date
    ? formatLocalDate(new Date(date).toISOString())
    : '';

  const handleContinue = () => {
    if (!selectedSlot) return;
    router.push({
      pathname: '/(app)/venues/[id]/confirm',
      params: {
        id,
        venueName: venueName ?? '',
        date,
        partySize,
        startUtc: selectedSlot.startUtc,
        endUtc: selectedSlot.endUtc,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Available Times</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Summary strip */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{displayDate}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Guests</Text>
            <Text style={styles.summaryValue}>{partySize}</Text>
          </View>
        </View>

        {/* Availability status */}
        <View style={[styles.statusBanner, available ? styles.statusAvailable : styles.statusUnavailable]}>
          <Text style={[styles.statusText, available ? styles.statusTextAvailable : styles.statusTextUnavailable]}>
            {reason}
          </Text>
        </View>

        {available && parsedSlots.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Choose a time</Text>
            <View style={styles.slotsGrid}>
              {parsedSlots.map((slot, i) => (
                <TimeSlotChip
                  key={i}
                  slot={slot}
                  selected={selectedSlot?.startUtc === slot.startUtc}
                  onPress={() => setSelectedSlot(slot)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noSlots}>
            <Text style={styles.noSlotsIcon}>🕐</Text>
            <Text style={styles.noSlotsText}>No slots available for this date and party size.</Text>
          </View>
        )}
      </ScrollView>

      {available && parsedSlots.length > 0 && (
        <View style={styles.footer}>
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedSlot}
          />
        </View>
      )}
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
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBanner: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  statusAvailable: {
    backgroundColor: Colors.statusConfirmedBg,
  },
  statusUnavailable: {
    backgroundColor: Colors.statusDeclinedBg,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTextAvailable: {
    color: Colors.statusConfirmed,
  },
  statusTextUnavailable: {
    color: Colors.statusDeclined,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  noSlots: {
    alignItems: 'center',
    paddingTop: 48,
  },
  noSlotsIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  noSlotsText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
});
