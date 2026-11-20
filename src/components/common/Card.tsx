import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, spacing} from '@/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Card({children, style}: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#0B2A33',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
});