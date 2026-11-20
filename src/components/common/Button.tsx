import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import AppText from './AppText';
import {colors, radius, spacing} from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: inactive, busy: loading}}
      disabled={inactive}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        pressed && styles.pressed,
        inactive && styles.inactive,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
      ) : (
        <AppText
          variant="subheading"
          color={isPrimary ? colors.white : colors.primary}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {backgroundColor: colors.primary},
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: {opacity: 0.85},
  inactive: {opacity: 0.6},
});