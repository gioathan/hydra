import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Colors } from '../../constants/colors';
import { FilterChip } from '../../components/FilterChip';
import { VenueCard } from '../../components/VenueCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { getVenues } from '../../lib/api/venues';
import { getVenueTypes } from '../../lib/api/venueTypes';
import type { VenueDto, VenueTypeDto } from '../../types';

const PAGE_SIZE = 25;

export default function HomeScreen() {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  const {
    data: venueTypesData,
  } = useQuery({
    queryKey: ['venueTypes'],
    queryFn: () => getVenueTypes(1, 50),
  });

  const venueTypes: VenueTypeDto[] = useMemo(
    () =>
      (venueTypesData?.items ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder),
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
    queryKey: ['venues'],
    queryFn: ({ pageParam = 1 }) => getVenues(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
  });

  const allVenues: VenueDto[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const filteredVenues = useMemo(() => {
    if (!selectedTypeId) return allVenues;
    return allVenues.filter((v) => v.venueTypeId === selectedTypeId);
  }, [allVenues, selectedTypeId]);

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Discover</Text>
        <Text style={styles.subtitle}>Find and book on Hydra island</Text>
      </View>

      {/* Filter chips */}
      {venueTypes.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filters}
        >
          <FilterChip
            label="All"
            selected={selectedTypeId === null}
            onPress={() => setSelectedTypeId(null)}
          />
          {venueTypes.map((t) => (
            <FilterChip
              key={t.id}
              label={t.name}
              selected={selectedTypeId === t.id}
              onPress={() => setSelectedTypeId(t.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Venue list */}
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={filteredVenues}
          keyExtractor={(item) => item.id}
          renderItem={renderVenueCard}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.navy}
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
              <Text style={styles.emptyIcon}>🏛️</Text>
              <Text style={styles.emptyTitle}>No venues found</Text>
              <Text style={styles.emptyText}>Try a different filter or pull to refresh.</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filters: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
