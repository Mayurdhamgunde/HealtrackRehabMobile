import React from 'react';
import {Text, TextProps} from 'react-native';
import {colors, typography} from '@/theme';

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

export default function AppText({
  variant = 'body',
  color = colors.text,
  style,
  ...rest
}: Props) {
  return <Text style={[typography[variant], {color}, style]} {...rest} />;
}