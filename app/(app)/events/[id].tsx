import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { T } from '../../../constants/typography';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { getEvent } from '../../../lib/api/venues';

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

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [imgError, setImgError] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
    staleTime: 60_000,
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>Event not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const hasPhoto = !!event.mainPhotoUrl && !imgError;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero photo with floating back button */}
        <View style={styles.heroContainer}>
          {hasPhoto ? (
            <Image
              source={{ uri: event.mainPhotoUrl! }}
              style={styles.hero}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.heroFallback}>
              <MaterialIcons name="event" size={56} color="rgba(255,255,255,0.35)" />
            </View>
          )}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={16} color={Colors.secondary} />
            <Text style={styles.dateText}>
              {formatEventDate(event.startsAtUtc, event.endsAtUtc)}
            </Text>
          </View>

          {/* Venue row — tappable, navigates to venue detail */}
          <Pressable
            style={styles.venueRow}
            onPress={() =>
              router.push({ pathname: '/(app)/venues/[id]', params: { id: event.venueId } })
            }
          >
            <MaterialIcons name="place" size={18} color={Colors.secondary} />
            <View style={styles.venueRowText}>
              <Text style={styles.venueName}>{event.venueName}</Text>
              {event.venueLocation ? (
                <Text style={styles.venueLocation}>{event.venueLocation}</Text>
              ) : null}
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.onSurfaceVariant} />
          </Pressable>

          {event.description ? (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ABOUT</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  eventTitle: {
    ...T.headlineMd,
    color: Colors.primary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dateText: {
    ...T.bodyMd,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.secondary,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  venueRowText: {
    flex: 1,
    gap: 2,
  },
  venueName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: Colors.primary,
  },
  venueLocation: {
    ...T.bodyMd,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
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
  descriptionText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  errorText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});
