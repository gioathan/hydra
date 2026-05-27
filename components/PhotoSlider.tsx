import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { VenuePlaceholder } from './VenuePlaceholder';
import { Colors } from '../constants/colors';
import type { VenuePhotoDto } from '../types';

function SingleImage({ uri, height, name, width }: { uri: string; height: number; name: string; width?: number | string }) {
  const [error, setError] = useState(false);
  if (error) return <VenuePlaceholder name={name} height={height} />;
  return (
    <Image
      source={{ uri }}
      style={{ width: width ?? '100%', height }}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
}

interface PhotoSliderProps {
  photos: VenuePhotoDto[];
  name: string;
  height: number;
}

export function PhotoSlider({ photos, name, height }: PhotoSliderProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const resolved = photos.filter((p) => p.photoUrl != null);

  if (resolved.length === 0) {
    return <VenuePlaceholder name={name} height={height} />;
  }

  if (resolved.length === 1) {
    return (
      <SingleImage uri={resolved[0].photoUrl!} height={height} name={name} />
    );
  }

  return (
    <View style={{ height }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        style={{ width, height }}
      >
        {resolved.map((photo) => (
          <SingleImage key={photo.id} uri={photo.photoUrl!} height={height} name={name} width={width} />
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {resolved.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.textInverse,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
