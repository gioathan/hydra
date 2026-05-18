import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';

interface StarRatingProps {
  rating: number;
  count: number;
  size?: number;
}

type StarIcon = 'star' | 'star-half' | 'star-border';

export function StarRating({ rating, count, size = 14 }: StarRatingProps) {
  if (count === 0) {
    return (
      <View style={styles.row}>
        <MaterialIcons name="star-border" size={size} color={Colors.outline} />
        <Text style={[styles.noRatings, { fontSize: size - 1 }]}>No ratings yet</Text>
      </View>
    );
  }

  const icons: StarIcon[] = [1, 2, 3, 4, 5].map((star) => {
    if (rating >= star) return 'star';
    if (rating >= star - 0.5) return 'star-half';
    return 'star-border';
  });

  return (
    <View style={styles.row}>
      {icons.map((icon, i) => (
        <MaterialIcons key={i} name={icon} size={size} color={Colors.secondary} />
      ))}
      <Text style={[styles.value, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      <Text style={[styles.count, { fontSize: size - 1 }]}>({count})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  value: {
    ...T.labelCaps,
    color: Colors.onSurface,
    letterSpacing: 0,
    textTransform: 'none',
    lineHeight: 18,
    marginLeft: 4,
  },
  count: {
    ...T.labelCaps,
    color: Colors.outline,
    letterSpacing: 0,
    textTransform: 'none',
    lineHeight: 18,
  },
  noRatings: {
    ...T.labelCaps,
    color: Colors.outline,
    letterSpacing: 0,
    textTransform: 'none',
    lineHeight: 18,
    marginLeft: 4,
  },
});
