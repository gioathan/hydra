import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { T } from '../../../constants/typography';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { getUpcomingEvents } from '../../../lib/api/venues';
import { getLocation } from '../../../lib/secureStore';
import type { EventListItemDto } from '../../../types';

const PAGE_SIZE = 10;

function formatEventDate(startsAtUtc: string, endsAtUtc: string | null): string {
  const start = new Date(startsAtUtc);
  const dateStr = start.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const startTime = start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  if (!endsAtUtc) return `${dateStr} · ${startTime}`;

  const end = new Date(endsAtUtc);
  const endTime = end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} · ${startTime} – ${endTime}`;
}

function EventCard({ event }: { event: EventListItemDto }) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = !!event.mainPhotoUrl && !imgError;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push({ pathname: '/(app)/venues/[id]', params: { id: event.venueId } })}
    >
      {/* Photo or gradient placeholder */}
      <View style={styles.cardMedia}>
        {hasPhoto ? (
          <Image
            source={{ uri: event.mainPhotoUrl! }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.cardImageFallback}>
            <MaterialIcons name="event" size={40} color="rgba(255,255,255,0.35)" />
          </View>
        )}

        {/* Date badge — top left */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeDay}>
            {new Date(event.startsAtUtc).toLocaleDateString(undefined, { day: 'numeric' })}
          </Text>
          <Text style={styles.dateBadgeMonth}>
            {new Date(event.startsAtUtc).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
          </Text>
        </View>

        {/* Scrim at bottom of photo */}
        <View style={styles.cardScrim} />

        {/* Venue name on scrim */}
        <View style={styles.cardScrimContent}>
          <MaterialIcons name="place" size={12} color="rgba(255,255,255,0.75)" />
          <Text style={styles.venueNameOverlay} numberOfLines={1}>{event.venueName}</Text>
        </View>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>

        <View style={styles.timeLine}>
          <MaterialIcons name="schedule" size={14} color={Colors.secondary} />
          <Text style={styles.timeText}>{formatEventDate(event.startsAtUtc, event.endsAtUtc)}</Text>
        </View>

        {event.description ? (
          <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          {event.venueLocation && (
            <View style={styles.locationPill}>
              <MaterialIcons name="location-on" size={12} color={Colors.secondary} />
              <Text style={styles.locationPillText}>{event.venueLocation}</Text>
            </View>
          )}
          <View style={styles.ctaChip}>
            <Text style={styles.ctaChipText}>View venue</Text>
            <MaterialIcons name="arrow-forward" size={12} color={Colors.secondary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const [location, setLocation] = useState<string | null>(null);
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    getLocation().then((loc) => {
      setLocation(loc);
      setLocationReady(true);
    });
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['upcomingEvents', location],
    queryFn: ({ pageParam = 1 }) => getUpcomingEvents(pageParam as number, PAGE_SIZE, location),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    enabled: locationReady,
  });

  const events: EventListItemDto[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderCard = useCallback(
    ({ item }: { item: EventListItemDto }) => <EventCard event={item} />,
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>UPCOMING</Text>
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        {location && (
          <View style={styles.locationChip}>
            <MaterialIcons name="location-on" size={13} color={Colors.secondary} />
            <Text style={styles.locationChipText}>{location}</Text>
          </View>
        )}
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={Colors.primary} size="small" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <MaterialIcons name="event-busy" size={36} color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.emptyTitle}>No upcoming events</Text>
              <Text style={styles.emptyText}>
                {location
                  ? `No events found in ${location}. Check back soon!`
                  : 'No events scheduled. Check back soon!'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(251,248,252,0.97)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerEyebrow: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.secondary,
    marginBottom: 2,
  },
  headerTitle: {
    ...T.headlineMd,
    fontSize: 28,
    color: Colors.primary,
    lineHeight: 32,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLow,
  },
  locationChipText: {
    ...T.labelCaps,
    fontSize: 11,
    color: Colors.primary,
    textTransform: 'none',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 20,
  },

  // ─── Event Card ───────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '33',
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    shadowOpacity: 0.04,
  },

  cardMedia: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  dateBadgeDay: {
    fontFamily: 'NotoSerif_700Bold',
    fontSize: 20,
    lineHeight: 22,
    color: Colors.onSecondary,
  },
  dateBadgeMonth: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },

  cardScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'transparent',
    // gradient via overlay — use a semi-transparent dark layer
    backgroundImage: undefined,
  },
  cardScrimContent: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  venueNameOverlay: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  cardBody: {
    padding: 16,
    gap: 8,
  },
  eventTitle: {
    fontFamily: 'NotoSerif_700Bold',
    fontSize: 18,
    lineHeight: 24,
    color: Colors.primary,
  },
  timeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: Colors.secondary,
  },
  description: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  locationPillText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  ctaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: Colors.secondary,
  },

  // ─── Footer / empty ───────────────────────────────────────────────
  footerLoader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    ...T.titleSm,
    color: Colors.primary,
    textAlign: 'center',
  },
  emptyText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
