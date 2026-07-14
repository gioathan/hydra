import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '../../../../constants/colors';
import { T } from '../../../../constants/typography';
import { rateVenue } from '../../../../lib/api/venues';
import { getAxiosErrorMessage } from '../../../../lib/utils';

const STARS = [1, 2, 3, 4, 5] as const;

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

export default function RateVenueScreen() {
  const { id, bookingId, venueName } = useLocalSearchParams<{
    id: string;
    bookingId: string;
    venueName: string;
  }>();

  const [selected, setSelected] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => rateVenue(id, { bookingId, value: selected }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRatings'] });
      queryClient.invalidateQueries({ queryKey: ['venue', id] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      router.back();
    },
    onError: (err) => {
      setError(getAxiosErrorMessage(err, 'Could not submit rating. Please try again.'));
    },
  });

  const handleSubmit = () => {
    setError(null);
    if (selected === 0) {
      setError('Please select a rating.');
      return;
    }
    mutation.mutate();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerBrand}>Local Bee</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Rate your visit</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {venueName ?? 'How was your experience?'}
          </Text>
        </View>

        <View style={styles.card}>
          {/* Star picker */}
          <View style={styles.starsRow}>
            {STARS.map((star) => (
              <Pressable
                key={star}
                onPress={() => setSelected(star)}
                hitSlop={8}
                style={({ pressed }) => [styles.starBtn, pressed && styles.starPressed]}
              >
                <MaterialIcons
                  name={selected >= star ? 'star' : 'star-border'}
                  size={48}
                  color={selected >= star ? Colors.secondary : Colors.outlineVariant}
                />
              </Pressable>
            ))}
          </View>

          {selected > 0 && (
            <Text style={styles.ratingLabel}>{LABELS[selected]}</Text>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              selected === 0 && styles.submitDisabled,
              pressed && selected > 0 && styles.pressed,
            ]}
            onPress={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <ActivityIndicator size="small" color={Colors.onPrimary} />
            ) : (
              <Text style={styles.submitLabel}>Submit Rating</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.skipBtn}>
            <Text style={styles.skipLabel}>Skip for now</Text>
          </Pressable>
        </View>
      </View>
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
    backgroundColor: 'rgba(251,248,252,0.8)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
  },
  headerBrand: {
    ...T.displayLg,
    fontSize: 24,
    letterSpacing: 8,
    color: Colors.primary,
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  titleSection: { marginBottom: 32 },
  title: { ...T.headlineMd, color: Colors.primary, marginBottom: 6 },
  subtitle: { ...T.bodyMd, fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22 },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '33',
    gap: 20,
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  starBtn: { padding: 4 },
  starPressed: { transform: [{ scale: 1.15 }] },
  ratingLabel: {
    ...T.titleSm,
    fontSize: 18,
    color: Colors.primary,
  },
  errorBox: {
    backgroundColor: Colors.errorContainer,
    borderRadius: 8,
    padding: 12,
    alignSelf: 'stretch',
  },
  errorText: {
    ...T.labelCaps,
    color: Colors.onErrorContainer,
    letterSpacing: 0,
    textTransform: 'none',
  },
  submitBtn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitDisabled: { opacity: 0.4 },
  submitLabel: { ...T.buttonText, color: Colors.onPrimary },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  skipBtn: { paddingVertical: 4 },
  skipLabel: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.outline,
    textDecorationLine: 'underline',
  },
});
