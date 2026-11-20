import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors, shadows} from '@/theme';
import AppText from './AppText';

type Props = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function StatCard({
  value,
  label,
  icon,
  trend,
  trendUp,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      {icon != null && <View style={styles.iconRow}>{icon}</View>}
      <AppText style={styles.value}>{value}</AppText>
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      {trend != null && (
        <AppText
          variant="caption"
          color={trendUp === true ? colors.success : colors.textMuted}
          style={styles.trend}>
          {trend}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    ...(shadows.md ?? {}),
  },
  iconRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 40,
  },
  trend: {
    marginTop: 4,
  },
});
