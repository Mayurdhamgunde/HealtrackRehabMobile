import React from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing} from '@/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

export default function Screen({
  children,
  scroll = false,
  edges = ['top'],
  contentStyle,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  content: {padding: spacing.lg},
});