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
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../../../constants/colors';
import { PhotoSlider } from '../../../../components/PhotoSlider';
import { CalendarPicker } from '../../../../components/CalendarPicker';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { getVenue, getAvailability } from '../../../../lib/api/venues';
import { getVenueTypes } from '../../../../lib/api/venueTypes';
import { formatDateParam } from '../../../../lib/utils';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [partySize, setPartySize] = useState(2);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const { data: venue, isLoading: venueLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenue(id),
    enabled: !!id,
  });

  const { data: venueTypesData } = useQuery({
    queryKey: ['venueTypes'],
    queryFn: () => getVenueTypes(1, 50),
  });

  const venueType = venueTypesData?.items.find((t) => t.id === venue?.venueTypeId);

  const handleSeeSlots = async () => {
    if (!venue) return;
    setCheckingSlots(true);
    setAvailabilityError(null);
    try {
      const result = await getAvailability(venue.id, formatDateParam(selectedDate), partySize);
      if (!result.isAvailable) {
        setAvailabilityError(result.reason ?? 'No slots available for this selection.');
        return;
      }
      router.push({
        pathname: '/(app)/venues/[id]/slots',
        params: {
          id: venue.id,
          date: formatDateParam(selectedDate),
          partySize: String(partySize),
          slots: JSON.stringify(result.availableSlots),
          isAvailable: 'true',
          reason: result.reason,
          venueName: venue.name,
        },
      });
    } catch {
      setAvailabilityError('Could not check availability. Please try again.');
    } finally {
      setCheckingSlots(false);
    }
  };

  if (venueLoading) return <LoadingSpinner fullScreen />;
  if (!venue) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Venue not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxParty = venue.capacity;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        {/* Hero image / slider */}
        <PhotoSlider photos={venue.photos} name={venue.name} height={260} />

        <View style={styles.content}>
          {/* Venue info */}
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.venueName}>{venue.name}</Text>
              {venueType && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{venueType.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{venue.address}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>Capacity: {venue.capacity} guests</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date picker section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select a Date</Text>
            <CalendarPicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDate={new Date()}
            />
          </View>

          {/* Party size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Party Size</Text>
            <View style={styles.partyStepper}>
              <Pressable
                style={[styles.stepBtn, partySize <= 1 && styles.stepBtnDisabled]}
                onPress={() => setPartySize((n) => Math.max(1, n - 1))}
                disabled={partySize <= 1}
              >
                <Text style={styles.stepIcon}>−</Text>
              </Pressable>
              <Text style={styles.partyCount}>{partySize}</Text>
              <Pressable
                style={[styles.stepBtn, partySize >= maxParty && styles.stepBtnDisabled]}
                onPress={() => setPartySize((n) => Math.min(maxParty, n + 1))}
                disabled={partySize >= maxParty}
              >
                <Text style={styles.stepIcon}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.partySizeHint}>Max {maxParty} guests</Text>
          </View>

          {availabilityError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{availabilityError}</Text>
            </View>
          )}

          <PrimaryButton
            title="See Available Slots"
            onPress={handleSeeSlots}
            loading={checkingSlots}
            style={styles.slotsBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  backText: {
    fontSize: 24,
    color: Colors.navy,
    lineHeight: 28,
  },
  content: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  venueName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    letterSpacing: -0.3,
  },
  typeBadge: {
    backgroundColor: Colors.navy,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaIcon: {
    fontSize: 15,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  partyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: Colors.border,
  },
  stepIcon: {
    fontSize: 22,
    color: Colors.textInverse,
    fontWeight: '700',
    lineHeight: 26,
  },
  partyCount: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  partySizeHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsBtn: {
    marginBottom: 32,
  },
});
