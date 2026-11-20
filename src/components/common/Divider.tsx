import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '@/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function Divider({style}: Props) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: colors.border,
  },
});
