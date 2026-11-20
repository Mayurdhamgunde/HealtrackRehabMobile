import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '@/theme';
import AppText from './AppText';

type Props = {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');
  return initials;
}

export default function Avatar({
  name,
  size = 40,
  backgroundColor = colors.primary,
  textColor = colors.white,
  style,
}: Props) {
  const initials = getInitials(name);
  return (
    <View
      style={[
        styles.circle,
        {width: size, height: size, borderRadius: size / 2, backgroundColor},
        style,
      ]}>
      <AppText variant="label" color={textColor}>
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
