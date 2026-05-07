import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { VenuePlaceholder } from './VenuePlaceholder';
import type { VenueDto, VenueTypeDto } from '../types';

interface VenueCardProps {
  venue: VenueDto;
  venueType?: VenueTypeDto;
  onPress: () => void;
  onBook: () => void;
}

export function VenueCard({ venue, venueType, onPress, onBook }: VenueCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {venue.photos[0]?.photoUrl ? (
        <Image source={{ uri: venue.photos[0].photoUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <VenuePlaceholder name={venue.name} height={180} />
      )}

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>
            {venueType && (
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{venueType.name}</Text>
              </View>
            )}
          </View>
          <Text style={styles.address} numberOfLines={1}>{venue.address}</Text>
        </View>

        <Pressable style={styles.bookButton} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  header: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  typeBadge: {
    backgroundColor: Colors.overlayLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.navy,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bookButton: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontWeight: '700',
    fontSize: 14,
  },
});
