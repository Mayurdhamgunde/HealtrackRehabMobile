import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AppText from '@/components/common/AppText';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import BackTopTab from '@/components/common/BackTopTab';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { signedOut } from '@/app/store/sessionSlice';
import { logout } from '@/features/auth/api/authRepository';
import { colors, radius, spacing } from '@/theme';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  iconBg: string;
  iconLetter: string;
  adminOnly?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    title: 'Staff Profile',
    subtitle: 'Name, specialty & credentials',
    iconBg: '#E3F3F6',
    iconLetter: 'P',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Alerts for sessions & patient check-ins',
    iconBg: '#FFF4E0',
    iconLetter: 'N',
  },
  {
    id: 'clinic',
    title: 'Clinic Administration',
    subtitle: 'Department configs & staff permissions',
    iconBg: '#EDE7F6',
    iconLetter: 'C',
    adminOnly: true,
  },
  {
    id: 'help',
    title: 'Help & Clinical Guidelines',
    subtitle: 'Documentation, protocols & FAQs',
    iconBg: '#E8F5E9',
    iconLetter: '?',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    subtitle: 'Data protection & compliance policies',
    iconBg: '#E0F2F1',
    iconLetter: 'S',
  },
  {
    id: 'about',
    title: 'About Healtrack Rehab',
    subtitle: 'Version 1.0.0 · Build 88',
    iconBg: '#ECEFF1',
    iconLetter: 'i',
  },
];

export default function MoreScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.session.user);

  const handleMenuPress = (item: MenuItem) => {
    Alert.alert(item.title, `${item.subtitle}\n(Feature available in demo preview)`);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            dispatch(signedOut());
          },
        },
      ],
    );
  };

  const visibleMenuItems = MENU_ITEMS.filter(
    item => !item.adminOnly || user?.isAdmin,
  );

  return (
    <View style={styles.container}>
      <BackTopTab screenName="Settings" />
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}>
        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
        <View style={styles.profileRow}>
          <Avatar
            name={user?.name ?? 'Staff User'}
            size={56}
            backgroundColor={colors.primary}
            textColor={colors.white}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <AppText variant="subheading" style={styles.profileName}>
              {user?.name ?? 'Staff Member'}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} style={styles.profileEmail}>
              {user?.email ?? 'staff@clinic.com'}
            </AppText>
            <View style={styles.badgeRow}>
              <Badge
                label={user?.isAdmin ? 'Admin' : 'Staff Therapist'}
                variant={user?.isAdmin ? 'info' : 'success'}
              />
            </View>
          </View>
        </View>

        {user?.organization ? (
          <View style={styles.orgRow}>
            <View style={styles.orgDot} />
            <AppText variant="caption" color={colors.textMuted}>
              {user.organization}
            </AppText>
          </View>
        ) : null}

        {/* Mini Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statCol}>
            <AppText variant="heading" color={colors.primary}>
              42
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              Patients
            </AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <AppText variant="heading" color={colors.primary}>
              5
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              Today
            </AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <AppText variant="heading" color={colors.primary}>
              3
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              Pending
            </AppText>
          </View>
        </View>
      </View>

      {/* ── Settings Menu ── */}
      <AppText variant="heading" style={styles.sectionHeader}>
        Settings & Tools
      </AppText>
      <View style={styles.menuCard}>
        {visibleMenuItems.map((item, index) => {
          const isLast = index === visibleMenuItems.length - 1;
          return (
            <Pressable
              key={item.id}
              onPress={() => handleMenuPress(item)}
              style={({ pressed }) => [
                styles.menuRow,
                !isLast && styles.menuRowDivider,
                pressed && styles.menuRowPressed,
              ]}>
              <View style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}>
                <AppText style={[styles.menuIconText, { color: colors.primaryDark }]}>
                  {item.iconLetter}
                </AppText>
              </View>

              <View style={styles.menuTextCol}>
                <AppText variant="subheading" style={styles.menuTitle}>
                  {item.title}
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {item.subtitle}
                </AppText>
              </View>

              <AppText style={styles.chevron}>›</AppText>
            </Pressable>
          );
        })}
      </View>

      {/* ── Sign Out Button ── */}
      <Pressable
        onPress={handleSignOut}
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.signOutButtonPressed,
        ]}>
        <AppText variant="subheading" color={colors.error} style={styles.signOutText}>
          Sign out
        </AppText>
      </Pressable>

      {/* ── App Version Footer ── */}
      <View style={styles.footer}>
        <AppText variant="caption" color={colors.textMuted} style={styles.footerText}>
          Healtrack Rehab Mobile · Version 1.0.0
        </AppText>
        <AppText variant="caption" color={colors.textMuted} style={styles.footerSub}>
          Demo Mode · Local Simulation
        </AppText>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    marginBottom: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2A33',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orgDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statCol: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2A33',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  menuRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuRowPressed: {
    backgroundColor: colors.background,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuIconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: '300',
    marginLeft: spacing.sm,
  },
  signOutButton: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  signOutButtonPressed: {
    backgroundColor: colors.errorLight,
  },
  signOutText: {
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    textAlign: 'center',
  },
  footerSub: {
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7,
  },
});
