import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';

function DecorativeCompass() {
  return (
    <View style={compass.root}>
      {/* Rotated background card */}
      <View style={compass.card} />

      {/* Corner brackets */}
      <View style={[compass.corner, compass.cornerTL]} />
      <View style={[compass.corner, compass.cornerTR]} />
      <View style={[compass.corner, compass.cornerBL]} />
      <View style={[compass.corner, compass.cornerBR]} />

      {/* Compass circles */}
      <View style={compass.ringOuter}>
        <View style={compass.ringMid}>
          <View style={compass.ringInner}>
            <View style={compass.dot} />
          </View>
        </View>
      </View>

      {/* Cardinal lines */}
      <View style={compass.lineV} />
      <View style={compass.lineH} />

      {/* Cardinal ticks */}
      <View style={[compass.tick, compass.tickN]} />
      <View style={[compass.tick, compass.tickS]} />
      <View style={[compass.tickH, compass.tickE]} />
      <View style={[compass.tickH, compass.tickW]} />
    </View>
  );
}

const COMPASS_SIZE = 240;
const RING_OUTER = 160;
const RING_MID = 108;
const RING_INNER = 48;

const compass = StyleSheet.create({
  root: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    inset: 0,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    transform: [{ rotate: '2deg' }],
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  cornerTL: { top: 14, left: 14, borderTopWidth: 2, borderLeftWidth: 2, borderColor: Colors.secondary + '40' },
  cornerTR: { top: 14, right: 14, borderTopWidth: 2, borderRightWidth: 2, borderColor: Colors.secondary + '40' },
  cornerBL: { bottom: 14, left: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: Colors.secondary + '40' },
  cornerBR: { bottom: 14, right: 14, borderBottomWidth: 2, borderRightWidth: 2, borderColor: Colors.secondary + '40' },
  ringOuter: {
    width: RING_OUTER,
    height: RING_OUTER,
    borderRadius: RING_OUTER / 2,
    borderWidth: 1,
    borderColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringMid: {
    width: RING_MID,
    height: RING_MID,
    borderRadius: RING_MID / 2,
    borderWidth: 1,
    borderColor: Colors.primary + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: RING_INNER,
    height: RING_INNER,
    borderRadius: RING_INNER / 2,
    borderWidth: 2,
    borderColor: Colors.secondary + '35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary + '55',
  },
  lineV: {
    position: 'absolute',
    width: 1,
    height: RING_OUTER,
    backgroundColor: Colors.primary + '12',
  },
  lineH: {
    position: 'absolute',
    height: 1,
    width: RING_OUTER,
    backgroundColor: Colors.primary + '12',
  },
  tick: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: Colors.primary + '25',
  },
  tickN: { top: (COMPASS_SIZE - RING_OUTER) / 2 },
  tickS: { bottom: (COMPASS_SIZE - RING_OUTER) / 2 },
  tickH: {
    height: 1,
    width: 8,
  },
  tickE: { right: (COMPASS_SIZE - RING_OUTER) / 2 },
  tickW: { left: (COMPASS_SIZE - RING_OUTER) / 2 },
});

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>

        {/* Brand */}
        <View style={styles.brandRow}>
          <Text style={styles.brand}>HYDRA</Text>
        </View>

        {/* Decorative compass */}
        <DecorativeCompass />

        {/* Copy */}
        <View style={styles.copySection}>
          <Text style={styles.headline}>
            Timeless Elegance{'\n'}
            <Text style={styles.headlineAccent}>in Every Detail.</Text>
          </Text>
          <Text style={styles.tagline}>
            Experience the quiet luxury of Hydra&apos;s most exclusive venues and cultural heritage.
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaGroup}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.primaryLabel}>Sign In</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.secondaryLabel}>Create Account</Text>
          </Pressable>
        </View>

        {/* Footer accent */}
        <View style={styles.footerRow}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>EST. 1960</Text>
          <View style={styles.footerLine} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  brand: {
    ...T.displayLg,
    letterSpacing: 12,
    color: Colors.primary,
  },
  copySection: {
    alignItems: 'center',
    gap: 10,
    maxWidth: 300,
  },
  headline: {
    ...T.headlineMd,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 36,
  },
  headlineAccent: {
    color: Colors.secondary,
    fontStyle: 'italic',
  },
  tagline: {
    ...T.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    marginTop: 4,
  },
  ctaGroup: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryLabel: {
    ...T.buttonText,
    color: Colors.onPrimary,
  },
  secondaryBtn: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    ...T.buttonText,
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.35,
  },
  footerLine: {
    width: 28,
    height: 1,
    backgroundColor: Colors.outline,
  },
  footerText: {
    ...T.labelCaps,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
  },
});
