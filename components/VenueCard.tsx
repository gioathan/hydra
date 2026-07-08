import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';
import { VenuePlaceholder } from './VenuePlaceholder';
import { StarRating } from './StarRating';
import type { VenueDto, VenueTypeDto } from '../types';

interface VenueCardProps {
  venue: VenueDto;
  venueType?: VenueTypeDto;
  onPress: () => void;
  onBook: () => void;
}

export function VenueCard({ venue, venueType, onPress, onBook }: VenueCardProps) {
  const photoUrl = [...venue.photos]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .find((p) => p.url != null)?.url ?? null;
  const [imgError, setImgError] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {photoUrl && !imgError ? (
          <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="cover" onError={() => setImgError(true)} />
        ) : (
          <VenuePlaceholder name={venue.name} height={256} />
        )}
        {venueType && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{venueType.name.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>
          <View style={styles.addressRow}>
            <MaterialIcons name="location-on" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.address} numberOfLines={1}>{venue.address}</Text>
          </View>
          <StarRating rating={venue.averageRating} count={venue.ratingCount} size={13} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
          onPress={onBook}
          hitSlop={4}
        >
          <Text style={styles.bookLabel}>Book</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '1A',
  },
  pressed: { transform: [{ scale: 0.98 }] },
  imageContainer: {
    height: 256,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    ...T.labelCaps,
    color: Colors.secondary,
    fontSize: 10,
  },
  body: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: { flex: 1, gap: 4 },
  name: { ...T.titleSm, color: Colors.primary },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  address: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  bookBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookBtnPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  bookLabel: { ...T.buttonText, color: Colors.onSecondary },
});
