import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';
import { VenueCard } from '../../components/VenueCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Avatar } from '../../components/Avatar';
import { getVenues } from '../../lib/api/venues';
import { getVenueTypes } from '../../lib/api/venueTypes';
import { getCustomer } from '../../lib/api/customers';
import { getPendingRatings } from '../../lib/api/ratings';
import { useAuthStore } from '../../lib/store/authStore';
import type { VenueDto, VenueTypeDto, PendingRatingDto } from '../../types';

const PAGE_SIZE = 25;


export default function HomeScreen() {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dismissedRatings, setDismissedRatings] = useState<Set<string>>(new Set());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { customerId } = useAuthStore();

  // Debounce search input — wait 400ms after user stops typing
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(searchText.trim()), 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [searchText]);

  const { data: pendingRatings = [] } = useQuery({
    queryKey: ['pendingRatings'],
    queryFn: getPendingRatings,
    enabled: !!customerId,
  });

  const visibleRatings = pendingRatings.filter((r) => !dismissedRatings.has(r.bookingId));

  const { data: customer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomer(customerId!),
    enabled: !!customerId,
  });

  const { data: venueTypesData } = useQuery({
    queryKey: ['venueTypes'],
    queryFn: () => getVenueTypes(1, 50),
  });

  const venueTypes: VenueTypeDto[] = useMemo(
    () => (venueTypesData?.items ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder),
    [venueTypesData]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['venues', selectedTypeId, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      getVenues(pageParam as number, PAGE_SIZE, selectedTypeId, debouncedSearch || undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });

  const venues: VenueDto[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const typeMap = useMemo(
    () => new Map(venueTypes.map((t) => [t.id, t])),
    [venueTypes]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderVenueCard = useCallback(
    ({ item }: { item: VenueDto }) => (
      <VenueCard
        venue={item}
        venueType={typeMap.get(item.venueTypeId)}
        onPress={() => router.push(`/(app)/venues/${item.id}`)}
        onBook={() => router.push(`/(app)/venues/${item.id}`)}
      />
    ),
    [typeMap]
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Fixed header */}
      <View style={styles.header}>
        <View style={{ width: 32 }} />
        <Text style={styles.brand}>HYDRA</Text>
        <Pressable onPress={() => router.push('/(app)/profile')} hitSlop={8}>
          <Avatar name={customer?.name} size={32} fontSize={14} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search venues…"
          placeholderTextColor={Colors.outline}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText('')} hitSlop={8}>
            <MaterialIcons name="close" size={18} color={Colors.outline} />
          </Pressable>
        )}
      </View>

      {/* Pending rating prompts */}
      {visibleRatings.map((item) => (
        <Pressable
          key={item.bookingId}
          style={({ pressed }) => [styles.ratingBanner, pressed && styles.pressed]}
          onPress={() => router.push({
            pathname: '/(app)/venues/[id]/rate',
            params: { id: item.venueId, bookingId: item.bookingId, venueName: item.venueName },
          })}
        >
          <MaterialIcons name="star" size={18} color={Colors.secondary} />
          <Text style={styles.ratingBannerText} numberOfLines={1}>
            Rate your visit to <Text style={styles.ratingBannerVenue}>{item.venueName}</Text>
          </Text>
          <Pressable
            onPress={() => setDismissedRatings((s) => new Set(s).add(item.bookingId))}
            hitSlop={8}
          >
            <MaterialIcons name="close" size={16} color={Colors.onSurfaceVariant} />
          </Pressable>
        </Pressable>
      ))}

      {/* Venue type tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <Pressable
            style={styles.tab}
            onPress={() => setSelectedTypeId(null)}
          >
            <Text style={[styles.tabLabel, selectedTypeId === null && styles.tabLabelActive]}>
              All
            </Text>
            {selectedTypeId === null && <View style={styles.tabIndicator} />}
          </Pressable>

          {venueTypes.map((t) => (
            <Pressable
              key={t.id}
              style={styles.tab}
              onPress={() => setSelectedTypeId(t.id)}
            >
              <Text style={[styles.tabLabel, selectedTypeId === t.id && styles.tabLabelActive]}>
                {t.name}
              </Text>
              {selectedTypeId === t.id && <View style={styles.tabIndicator} />}
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.tabsBottomBorder} />
      </View>

      {/* Venue list */}
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id}
          renderItem={renderVenueCard}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
                <LoadingSpinner size="small" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <MaterialIcons name="place" size={36} color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.emptyTitle}>
                {debouncedSearch ? `No results for "${debouncedSearch}"` : 'No venues found'}
              </Text>
              <Text style={styles.emptyText}>
                {debouncedSearch ? 'Try a different search term.' : 'Try a different category or pull to refresh.'}
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: 20,
    height: 64,
    backgroundColor: 'rgba(251,248,252,0.97)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  brand: {
    ...T.displayLg,
    fontSize: 22,
    letterSpacing: 8,
    color: Colors.primary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    ...T.bodyMd,
    fontSize: 15,
    color: Colors.onSurface,
    paddingVertical: 0,
  },

  ratingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.secondaryFixed,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ratingBannerText: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.onSecondaryFixed,
    flex: 1,
  },
  ratingBannerVenue: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  tabsWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  tabsContent: {
    paddingHorizontal: 20,
  },
  tabsBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 24,
    position: 'relative',
    alignItems: 'center',
  },
  tabLabel: {
    ...T.buttonText,
    fontSize: 14,
    color: Colors.outline,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.secondary,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
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
