import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { PhotoSlider } from '../../../../components/PhotoSlider';
import { CalendarPicker } from '../../../../components/CalendarPicker';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { StarRating } from '../../../../components/StarRating';
import { getVenue, getAvailability } from '../../../../lib/api/venues';
import { getVenueTypes } from '../../../../lib/api/venueTypes';
import { formatDateParam } from '../../../../lib/utils';

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [partySize, setPartySize] = useState(2);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);

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
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>Venue not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxParty = venue.capacity;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero photo with floating back button */}
        <View style={styles.heroContainer}>
          <PhotoSlider photos={venue.photos} name={venue.name} height={300} />
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
          </Pressable>
          {venueType && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{venueType.name.toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Venue header */}
          <View style={styles.venueHeader}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.metaRow}>
              <MaterialIcons name="location-on" size={16} color={Colors.secondary} />
              <Text style={styles.metaText}>{venue.address}</Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialIcons name="people" size={16} color={Colors.onSurfaceVariant} />
              <Text style={styles.metaText}>Up to {venue.capacity} guests</Text>
            </View>
            <StarRating rating={venue.averageRating} count={venue.ratingCount} size={15} />
            {venue.googleMapsUrl && (
              <Pressable
                style={styles.mapsBtn}
                onPress={() => Linking.openURL(venue.googleMapsUrl!)}
              >
                <MaterialIcons name="map" size={16} color={Colors.secondary} />
                <Text style={styles.mapsBtnText}>Open in Maps</Text>
              </Pressable>
            )}
          </View>

          {venue.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ABOUT</Text>
                <Text style={styles.descriptionText}>{venue.description}</Text>
              </View>
            </>
          )}

          {venue.pricingItems.length > 0 && (
            <>
              <View style={styles.divider} />
              <Pressable style={styles.pricingBtn} onPress={() => setPricingOpen(true)}>
                <MaterialIcons name="receipt-long" size={18} color={Colors.secondary} />
                <Text style={styles.pricingBtnText}>Menu & Pricing</Text>
                <View style={styles.pricingBtnSpacer} />
                <MaterialIcons name="chevron-right" size={18} color={Colors.secondary} />
              </Pressable>
            </>
          )}

          <View style={styles.divider} />

          {/* Date picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT A DATE</Text>
            <CalendarPicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              minDate={new Date()}
            />
          </View>

          <View style={styles.divider} />

          {/* Party size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARTY SIZE</Text>
            <View style={styles.stepperRow}>
              <Pressable
                style={[styles.stepBtn, partySize <= 1 && styles.stepBtnDisabled]}
                onPress={() => setPartySize((n) => Math.max(1, n - 1))}
                disabled={partySize <= 1}
              >
                <MaterialIcons name="remove" size={20} color={partySize <= 1 ? Colors.outline : Colors.onPrimary} />
              </Pressable>
              <Text style={styles.partyCount}>{partySize}</Text>
              <Pressable
                style={[styles.stepBtn, partySize >= maxParty && styles.stepBtnDisabled]}
                onPress={() => setPartySize((n) => Math.min(maxParty, n + 1))}
                disabled={partySize >= maxParty}
              >
                <MaterialIcons name="add" size={20} color={partySize >= maxParty ? Colors.outline : Colors.onPrimary} />
              </Pressable>
            </View>
            <Text style={styles.partySizeHint}>Maximum {maxParty} guests</Text>
          </View>

          {availabilityError && (
            <View style={styles.errorBox}>
              <MaterialIcons name="info-outline" size={16} color={Colors.error} style={styles.errorIcon} />
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

      {/* Pricing modal */}
      <Modal
        visible={pricingOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPricingOpen(false)}
      >
        <View style={m.container}>
          {/* Backdrop tap-to-dismiss */}
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setPricingOpen(false)} />

          {/* Sheet */}
          <View style={m.sheet}>
            <View style={m.handle} />

            <View style={m.header}>
              <Text style={m.headerTitle}>Menu & Pricing</Text>
              <Pressable onPress={() => setPricingOpen(false)} hitSlop={12}>
                <MaterialIcons name="close" size={22} color={Colors.onSurfaceVariant} />
              </Pressable>
            </View>

            <ScrollView style={m.scroll} contentContainerStyle={m.scrollContent} showsVerticalScrollIndicator={false}>
              {(() => {
                const groups = [...venue.pricingItems]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .reduce((map, item) => {
                    const key = item.category ?? '';
                    if (!map.has(key)) map.set(key, [] as typeof venue.pricingItems);
                    map.get(key)!.push(item);
                    return map;
                  }, new Map<string, typeof venue.pricingItems>());

                return Array.from(groups.entries()).map(([category, items]) => (
                  <View key={category || '__none__'} style={m.group}>
                    {category ? (
                      <View style={m.categoryRow}>
                        <Text style={m.categoryLabel}>{category.toUpperCase()}</Text>
                        <View style={m.categoryLine} />
                      </View>
                    ) : null}
                    {items.map((item, idx) => (
                      <View key={item.id} style={[m.itemRow, idx < items.length - 1 && m.itemBorder]}>
                        <View style={m.itemLeft}>
                          <Text style={m.itemTitle}>{item.title}</Text>
                          {item.subtitle ? <Text style={m.itemSubtitle}>{item.subtitle}</Text> : null}
                        </View>
                        <Text style={m.itemPrice}>€{item.price.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>
                ));
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  heroContainer: {
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.primary,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  typeText: {
    ...T.labelCaps,
    color: Colors.onPrimary,
    fontSize: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  venueHeader: {
    gap: 8,
    marginBottom: 20,
  },
  venueName: {
    ...T.headlineMd,
    color: Colors.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  mapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  mapsBtnText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + '4D',
    marginVertical: 20,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    ...T.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  partyCount: {
    ...T.headlineMd,
    color: Colors.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  partySizeHint: {
    ...T.labelCaps,
    color: Colors.outline,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'none',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.errorContainer,
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  errorIcon: { marginTop: 1 },
  errorText: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotsBtn: {
    marginTop: 24,
  },
  descriptionText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  pricingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryFixed + '33',
    flex: 0,
  },
  pricingBtnSpacer: { flex: 1 },
  pricingBtnText: {
    ...T.bodyMd,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.secondary,
  },
});

const m = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: WINDOW_HEIGHT * 0.85,
    paddingBottom: 32,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerTitle: {
    ...T.headlineMd,
    fontSize: 16,
    color: Colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  group: { marginTop: 16 },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  categoryLabel: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.secondary,
  },
  categoryLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.secondaryFixed,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant + '66',
  },
  itemLeft: { flex: 1, gap: 2 },
  itemTitle: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurface,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  itemSubtitle: {
    ...T.bodyMd,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  itemPrice: {
    ...T.bodyMd,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.secondary,
  },
});
