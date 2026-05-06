import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { PrimaryButton } from '../../components/PrimaryButton';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.root}>
      {/* Hero background */}
      <Image
        source={require('../../assets/images/splash.png')}
        style={styles.bg}
        resizeMode="cover"
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Top — logo + branding */}
          <View style={styles.topSection}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Hydra</Text>
            <Text style={styles.tagline}>Book the best of the island.</Text>
          </View>

          {/* Bottom — CTAs */}
          <View style={styles.bottomSection}>
            <PrimaryButton
              title="Sign In"
              onPress={() => router.push('/(auth)/login')}
              variant="primary"
              style={styles.signInBtn}
            />
            <PrimaryButton
              title="Create Account"
              onPress={() => router.push('/(auth)/register')}
              variant="ghost"
              style={styles.createBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.navy,
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
    backgroundColor: 'rgba(10, 18, 35, 0.55)',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  topSection: {
    marginTop: height * 0.12,
    alignItems: 'flex-start',
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 16,
    tintColor: Colors.textInverse,
  },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  tagline: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    fontWeight: '400',
  },
  bottomSection: {
    gap: 12,
    marginBottom: 16,
  },
  signInBtn: {
    backgroundColor: Colors.terracotta,
  },
  createBtn: {
    borderColor: 'rgba(255,255,255,0.6)',
  },
});
