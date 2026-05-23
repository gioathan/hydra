import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Share,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';
import { LegalSection } from '../lib/legalContent';

interface LegalScreenProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  shareMessage: string;
}

export function LegalScreen({ title, lastUpdated, sections, shareMessage }: LegalScreenProps) {
  const handleShare = async () => {
    await Share.share({ message: shareMessage });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <MaterialIcons name="chevron-left" size={28} color={Colors.onSurfaceVariant} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>

        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.headerBtnPressed]}
          onPress={handleShare}
          hitSlop={8}
        >
          <MaterialIcons name="ios-share" size={22} color={Colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>

        {sections.map((section, i) => (
          <View key={section.title} style={[styles.section, i > 0 && styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    backgroundColor: Colors.background,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerBtnPressed: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  headerTitle: {
    ...T.labelCaps,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 0,
  },
  lastUpdated: {
    ...T.bodyMd,
    fontSize: 12,
    color: Colors.outline,
    marginBottom: 24,
  },
  section: {
    paddingVertical: 20,
    gap: 8,
  },
  sectionBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
  },
  sectionTitle: {
    ...T.labelCaps,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  sectionBody: {
    ...T.bodyMd,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.onSurfaceVariant,
  },
});
