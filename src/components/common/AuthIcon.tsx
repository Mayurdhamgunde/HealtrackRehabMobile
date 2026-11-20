import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type AuthIconName =
  | 'email'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'arrow-left'
  | 'refresh'
  | 'close'
  | 'shield-key'
  | 'lock-check';

interface Props {
  name: AuthIconName;
  size?: number;
  color?: string;
}

export default function AuthIcon({
  name,
  size = 20,
  color = '#007b8e',
}: Props) {
  return <Icon name={name} size={size} color={color} />;
}
