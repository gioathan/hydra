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
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
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

  const displayDate = date ? formatLocalDate(new Date(date).toISOString()) : '';

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
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Available Times</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Venue name */}
        {venueName ? <Text style={styles.venueName}>{venueName}</Text> : null}

        {/* Summary strip */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DATE</Text>
            <Text style={styles.summaryValue}>{displayDate}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>GUESTS</Text>
            <Text style={styles.summaryValue}>{partySize}</Text>
          </View>
        </View>

        {available && parsedSlots.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>CHOOSE A TIME</Text>
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
            <View style={styles.noSlotsIcon}>
              <MaterialIcons name="schedule" size={32} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={styles.noSlotsTitle}>No slots available</Text>
            <Text style={styles.noSlotsText}>
              {reason || 'No available times for this date and party size.'}
            </Text>
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
  venueName: {
    ...T.headlineMd,
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: 16,
  },
  summaryLabel: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  summaryValue: {
    ...T.titleSm,
    fontSize: 15,
    color: Colors.primary,
  },
  sectionTitle: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 4,
  },
  noSlots: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
  },
  noSlotsIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noSlotsTitle: {
    ...T.titleSm,
    color: Colors.primary,
  },
  noSlotsText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
});
