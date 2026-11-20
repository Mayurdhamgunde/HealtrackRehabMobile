import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import AppText from '@/components/common/AppText';
import {colors, radius, spacing} from '@/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

export default function TextField({
  label,
  error,
  isPassword = false,
  style,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <AppText variant="label" color={colors.textMuted} style={styles.label}>
        {label}
      </AppText>
      <View
        style={[
          styles.inputRow,
          focused && styles.focused,
          !!error && styles.errored,
        ]}>
        <TextInput
          {...rest}
          accessibilityLabel={label}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, style]}
        />
        {isPassword ? (
          <Pressable hitSlop={8} onPress={() => setHidden(h => !h)}>
            <AppText variant="label" color={colors.primary}>
              {hidden ? 'Show' : 'Hide'}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {marginBottom: spacing.lg},
  label: {marginBottom: spacing.xs},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  focused: {borderColor: colors.primary},
  errored: {borderColor: colors.error},
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: {marginTop: spacing.xs},
});