import React from 'react';
import {View, Pressable, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '@/theme';
import AppText from './AppText';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <AppText variant="heading">{title}</AppText>
      {actionLabel != null && (
        <Pressable onPress={onAction} hitSlop={8}>
          <AppText variant="label" color={colors.primary}>
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
