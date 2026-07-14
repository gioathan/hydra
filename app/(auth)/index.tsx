import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';

function SchedulePreview() {
  return (
    <View style={sp.container}>
      <View style={sp.header}>
        <View style={sp.headerLine} />
        <Text style={sp.headerLabel}>SCHEDULE</Text>
      </View>

      <Text style={sp.dayLabel}>Today · May 24</Text>

      {/* Entry 1 — Confirmed */}
      <View style={sp.entry}>
        <View style={sp.timeCol}>
          <Text style={sp.time}>19:00</Text>
          <View style={sp.dotConfirmed} />
          <View style={sp.line} />
        </View>
        <View style={sp.card}>
          <View style={sp.cardTop}>
            <Text style={sp.venueName}>The Rooftop Bar</Text>
            <View style={sp.badgeConfirmed}><Text style={sp.badgeConfirmedText}>Confirmed</Text></View>
          </View>
          <Text style={sp.venueType}>Cocktail Lounge · Soho</Text>
          <Text style={sp.meta}>2 guests · Ref #A2F9</Text>
        </View>
      </View>

      {/* Entry 2 — Pending */}
      <View style={sp.entry}>
        <View style={sp.timeCol}>
          <Text style={sp.time}>21:30</Text>
          <View style={sp.dotPending} />
          <View style={[sp.line, sp.lineFaded]} />
        </View>
        <View style={[sp.card, sp.cardFaded]}>
          <View style={sp.cardTop}>
            <Text style={[sp.venueName, sp.nameFaded]}>Sakura Garden</Text>
            <View style={sp.badgePending}><Text style={sp.badgePendingText}>Pending</Text></View>
          </View>
          <Text style={[sp.venueType, sp.venueFaded]}>Japanese · Covent Garden</Text>
          <Text style={[sp.meta, sp.metaFaded]}>4 guests · Ref #B7C1</Text>
        </View>
      </View>

      {/* Tomorrow */}
      <View style={sp.tomorrowBlock}>
        <Text style={sp.tomorrowLabel}>Tomorrow · May 25</Text>
        <View style={[sp.entry, { opacity: 0.4 }]}>
          <View style={sp.timeCol}>
            <Text style={sp.time}>20:00</Text>
            <View style={sp.dotOutline} />
          </View>
          <View style={[sp.card, sp.cardVeryFaded]}>
            <View style={sp.cardTop}>
              <Text style={[sp.venueName, { opacity: 0.5 }]}>La Maison</Text>
              <View style={sp.badgePendingFaded}><Text style={sp.badgePendingFadedText}>Pending</Text></View>
            </View>
            <Text style={[sp.venueType, { opacity: 0.6 }]}>French Bistro · Chelsea</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const sp = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: Colors.onSecondaryContainer,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  headerLine: {
    width: 20,
    height: 1,
    backgroundColor: Colors.secondaryFixedDim,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.secondaryFixedDim + 'cc',
    textTransform: 'uppercase',
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 46,
  },
  entry: {
    flexDirection: 'row',
    gap: 10,
  },
  timeCol: {
    width: 36,
    alignItems: 'center',
  },
  time: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  dotConfirmed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondaryFixedDim,
  },
  dotPending: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'transparent',
  },
  dotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
    minHeight: 12,
  },
  lineFaded: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  cardFaded: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 6,
  },
  cardVeryFaded: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 0,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  venueName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  nameFaded: { color: 'rgba(255,255,255,0.65)' },
  venueType: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.38)',
    marginBottom: 4,
  },
  venueFaded: { color: 'rgba(255,255,255,0.28)' },
  meta: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.22)',
  },
  metaFaded: { color: 'rgba(255,255,255,0.16)' },
  badgeConfirmed: {
    backgroundColor: 'rgba(21,128,61,0.22)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeConfirmedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9FD3A6',
  },
  badgePending: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgePendingText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(251,191,36,0.9)',
  },
  badgePendingFaded: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgePendingFadedText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(251,191,36,0.55)',
  },
  tomorrowBlock: {
    opacity: 0.7,
  },
  tomorrowLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.18)',
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingLeft: 46,
  },
});

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>

        {/* Brand */}
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/images/brand-mark.png')}
            style={styles.brandMark}
            resizeMode="contain"
          />
          <Text style={styles.brand}>Local Bee</Text>
        </View>

        {/* Schedule preview */}
        <SchedulePreview />

        {/* Copy */}
        <View style={styles.copySection}>
          <Text style={styles.headline}>
            Find, Book{'\n'}
            <Text style={styles.headlineAccent}>&amp; Enjoy.</Text>
          </Text>
          <Text style={styles.tagline}>
            Browse restaurants, bars, cafés and activities. Book your next experience in seconds.
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
    gap: 8,
  },
  brandMark: {
    width: 72,
    height: 72,
  },
  brand: {
    ...T.displayLg,
    letterSpacing: 4,
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
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    ...T.buttonText,
    color: Colors.secondary,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
