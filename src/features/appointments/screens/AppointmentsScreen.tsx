import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BackTopTab from '@/components/common/BackTopTab';
import AppText from '@/components/common/AppText';
import {colors, radius, spacing} from '@/theme';
import {
  Appointment,
  mockAppointments,
} from '@/features/appointments/mock/appointmentsMock';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'Today' | 'Tomorrow' | 'This Week' | 'All';

const TABS: Tab[] = ['Today', 'Tomorrow', 'This Week', 'All'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<Appointment['type'], string> = {
  Individual: colors.primary,
  Group: '#5C6BC0',
  Assessment: '#F57C00',
  'Follow-up': '#2E7D32',
};

const STATUS_STYLES: Record<
  Appointment['status'],
  {bg: string; text: string}
> = {
  Confirmed: {bg: colors.successLight, text: colors.success},
  Pending: {bg: colors.warningLight, text: colors.warning},
  Completed: {bg: '#E3F3F6', text: colors.primary},
  Cancelled: {bg: colors.errorLight, text: colors.error},
};

function filterAppointments(list: Appointment[], tab: Tab): Appointment[] {
  if (tab === 'All') return list;
  if (tab === 'This Week') {
    // dates that are neither "Today" nor "Tomorrow" are future-week dates
    return list.filter(
      a => a.date === 'Today' || a.date === 'Tomorrow' || (!a.date.startsWith('Mon') && a.date.includes(',')),
    );
  }
  return list.filter(a => a.date === tab);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({status}: {status: Appointment['status']}) {
  const s = STATUS_STYLES[status];
  return (
    <View style={[styles.badge, {backgroundColor: s.bg}]}>
      <AppText variant="caption" style={[styles.badgeText, {color: s.text}]}>
        {status}
      </AppText>
    </View>
  );
}

function AppointmentCard({item}: {item: Appointment}) {
  const typeColor = TYPE_COLORS[item.type];

  return (
    <Pressable
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
      {/* Top row: type + status */}
      <View style={styles.cardTopRow}>
        <View style={styles.typeWrapper}>
          <View style={[styles.typeIcon, {backgroundColor: typeColor}]} />
          <AppText
            variant="label"
            style={[styles.typeLabel, {color: typeColor}]}>
            {item.type}
          </AppText>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Patient name */}
      <AppText variant="subheading" style={styles.patientName}>
        {item.patientName}
      </AppText>

      {/* Date + Time */}
      <View style={styles.infoRow}>
        <View style={styles.calIcon} />
        <AppText variant="caption" color={colors.textMuted}>
          {item.date} · {item.time}
        </AppText>
      </View>

      {/* Duration + Room */}
      <AppText variant="caption" color={colors.textMuted} style={styles.detail}>
        {item.duration} · {item.room}
      </AppText>

      {/* Therapist */}
      <AppText variant="caption" color={colors.textMuted} style={styles.detail}>
        {item.therapist}
      </AppText>

      {/* Notes */}
      {item.notes ? (
        <View style={styles.notesBox}>
          <AppText
            variant="caption"
            color={colors.primary}
            style={styles.notesText}>
            {item.notes}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration} />
      <AppText variant="subheading" color={colors.textMuted} style={styles.emptyText}>
        No appointments
      </AppText>
      <AppText variant="caption" color={colors.textMuted}>
        Nothing scheduled for this period.
      </AppText>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const filtered = filterAppointments(mockAppointments, activeTab);

  return (
    <View style={styles.container}>
      <BackTopTab screenName="Appointments" />
      <View style={styles.body}>
        {/* Date filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
          style={styles.tabsScroll}>
          {TABS.map(tab => {
            const active = tab === activeTab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, active && styles.tabActive]}>
                <AppText
                  variant="label"
                  style={{color: active ? colors.white : colors.textMuted}}>
                  {tab}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Appointment list */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({item}) => <AppointmentCard item={item} />}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  /* Header */
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    marginBottom: 2,
  },

  /* Tabs */
  tabsScroll: {
    marginBottom: spacing.lg,
    flexGrow: 0,
  },
  tabsRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* List */
  listContent: {
    paddingBottom: spacing.xxl,
  },

  /* Card */
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#0B2A33',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: {width: 0, height: 4},
      },
      android: {elevation: 3},
    }),
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  typeLabel: {
    // color set inline
  },
  patientName: {
    fontWeight: '700',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  calIcon: {
    width: 10,
    height: 10,
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
  detail: {
    marginBottom: 2,
  },
  notesBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  notesText: {
    fontStyle: 'italic',
  },

  /* Badge */
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontWeight: '600',
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
    gap: spacing.sm,
  },
  emptyIllustration: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  emptyText: {
    marginBottom: 2,
  },
});
