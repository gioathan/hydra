import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { getInitial } from '../lib/utils';

interface AvatarProps {
  name: string | null | undefined;
  size?: number;
  fontSize?: number;
}

export function Avatar({ name, size = 48, fontSize = 20 }: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: Colors.terracotta },
      ]}
    >
      <Text style={[styles.initial, { fontSize }]}>{getInitial(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
});
