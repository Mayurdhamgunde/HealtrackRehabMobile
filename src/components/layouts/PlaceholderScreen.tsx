import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '@/components/common/AppText';
import Screen from '@/components/layouts/Screen';
import {colors, radius, spacing} from '@/theme';

type Props = {
  title: string;
  description: string;
};

export default function PlaceholderScreen({title, description}: Props) {
  return (
    <Screen contentStyle={styles.center}>
      <View style={styles.badge}>
        <AppText variant="label" color={colors.primaryDark}>
          Coming soon
        </AppText>
      </View>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.text}>
        {description}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {justifyContent: 'center', alignItems: 'center'},
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {marginBottom: spacing.sm},
  text: {textAlign: 'center', maxWidth: 280},
});