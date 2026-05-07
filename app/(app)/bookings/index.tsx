import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Colors } from '../../../constants/colors';
import { BookingCard } from '../../../components/BookingCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { getBookings } from '../../../lib/api/bookings';
import { getVenue } from '../../../lib/api/venues';
import { useAuthStore } from '../../../lib/store/authStore';
import { parseISO, isBefore } from 'date-fns';
import type { BookingDto } from '../../../types';

type Tab = 'upcoming' | 'past';

function useVenueNames(venueIds: string[]) {
  const uniqueIds = [...new Set(venueIds)];
  const queries = useQuery({
    queryKey: ['venueNamesForBookings', uniqueIds],
    queryFn: async () => {
      const results = await Promise.allSettled(uniqueIds.map((id) => getVenue(id)));
      const map: Record<string, string> = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') map[uniqueIds[i]] = r.value.name;
      });
      return map;
    },
    enabled: uniqueIds.length > 0,
  });
  return queries.data ?? {};
}

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { customerId } = useAuthStore();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['bookings', customerId],
    queryFn: () => getBookings(customerId!, undefined, 1, 100),
    enabled: !!customerId,
  });

  const allBookings: BookingDto[] = data?.items ?? [];
  const now = new Date();

  const upcomingBookings = useMemo(
    () =>
      allBookings
        .filter((b) => {
          if (b.status === 'Pending') return !isBefore(parseISO(b.startUtc), now);
          if (b.status === 'Confirmed') return !isBefore(parseISO(b.endUtc), now);
          return false;
        })
        .sort((a, b) => parseISO(a.startUtc).getTime() - parseISO(b.startUtc).getTime()),
    [allBookings]
  );

  const pastBookings = useMemo(
    () =>
      allBookings
        .filter((b) => {
          if (b.status === 'Declined' || b.status === 'Cancelled') return true;
          if (b.status === 'Confirmed' && isBefore(parseISO(b.endUtc), now)) return true;
          return false;
        })
        .sort((a, b) => parseISO(b.startUtc).getTime() - parseISO(a.startUtc).getTime()),
    [allBookings]
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  const venueIds = displayedBookings.map((b) => b.venueId);
  const venueNames = useVenueNames(venueIds);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabLabel, activeTab === 'upcoming' && styles.tabLabelActive]}>
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabLabel, activeTab === 'past' && styles.tabLabelActive]}>
            Past
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={displayedBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              venueName={venueNames[item.venueId]}
              onPress={() => router.push(`/(app)/bookings/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.navy}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>{activeTab === 'upcoming' ? '📅' : '🗂️'}</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'upcoming'
                  ? 'Explore venues and make your first booking!'
                  : 'Your completed bookings will appear here.'}
              </Text>
              {activeTab === 'upcoming' && (
                <PrimaryButton
                  title="Discover Venues"
                  onPress={() => router.replace('/(app)')}
                  style={styles.discoverBtn}
                />
              )}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.card,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.navy,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
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
    marginBottom: 28,
    lineHeight: 21,
  },
  discoverBtn: {
    width: 200,
  },
});
