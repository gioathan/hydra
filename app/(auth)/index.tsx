import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { T } from '../../constants/typography';

export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/images/splash.png')}
        style={styles.bg}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <Text style={styles.brand}>HYDRA</Text>
            <View style={styles.brandDivider} />
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.tagline}>Book the best of the island.</Text>

            <Pressable
              style={({ pressed }) => [styles.signInBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.signInLabel}>Sign In</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.createBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.createLabel}>Create Account</Text>
            </Pressable>

            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(4, 22, 53, 0.82)',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: 64,
    alignItems: 'center',
  },
  brand: {
    ...T.displayLg,
    color: Colors.surfaceBright,
    letterSpacing: 12,
  },
  brandDivider: {
    width: 48,
    height: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 1,
    marginTop: 8,
  },
  bottomSection: {
    gap: 16,
    paddingBottom: 40,
  },
  tagline: {
    ...T.bodyMd,
    color: 'rgba(251,248,252,0.85)',
    textAlign: 'center',
    marginBottom: 8,
  },
  signInBtn: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  signInLabel: {
    ...T.buttonText,
    color: Colors.onPrimary,
  },
  createBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(251,248,252,0.4)',
    backgroundColor: 'rgba(251,248,252,0.08)',
  },
  createLabel: {
    ...T.buttonText,
    color: Colors.surfaceBright,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(251,248,252,0.3)',
  },
  dotActive: {
    backgroundColor: Colors.secondary,
  },
});
