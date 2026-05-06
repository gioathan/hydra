import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { getInitial } from '../lib/utils';

interface VenuePlaceholderProps {
  name: string;
  height?: number;
}

export function VenuePlaceholder({ name, height = 180 }: VenuePlaceholderProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.initial}>{getInitial(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  initial: {
    fontSize: 64,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
});
