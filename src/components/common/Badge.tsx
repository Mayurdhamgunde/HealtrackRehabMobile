import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {radius} from '@/theme';
import AppText from './AppText';

type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

type Props = {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

const variantMap: Record<Variant, {bg: string; text: string}> = {
  success: {bg: '#E8F5E9', text: '#2E7D32'},
  warning: {bg: '#FFF4E0', text: '#B26A00'},
  error: {bg: '#FDECEA', text: '#C62828'},
  info: {bg: '#E3F3F6', text: '#007B8E'},
  neutral: {bg: '#F4F8FA', text: '#5E7783'},
};

export default function Badge({label, variant = 'neutral', style}: Props) {
  const {bg, text} = variantMap[variant];
  return (
    <View style={[styles.pill, {backgroundColor: bg}, style]}>
      <AppText variant="caption" color={text} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
