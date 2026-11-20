import React, {useState, useMemo} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BackTopTab from '@/components/common/BackTopTab';
import AppText from '@/components/common/AppText';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import {mockPatients, Patient, PatientStatus} from '@/features/patients/mock/patientsMock';
import {colors, radius, spacing} from '@/theme';

type FilterOption = 'All' | PatientStatus;

const FILTERS: FilterOption[] = ['All', 'Active', 'Discharged', 'On Hold'];

function statusVariant(
  status: PatientStatus,
): 'success' | 'neutral' | 'warning' {
  if (status === 'Active') {
    return 'success';
  }
  if (status === 'Discharged') {
    return 'neutral';
  }
  return 'warning';
}

function PatientCard({patient}: {patient: Patient}) {
  const progressText = `${patient.sessionsCompleted}/${patient.totalSessions} sessions`;

  return (
    <Pressable
      onPress={() =>
        Alert.alert('Patient', `Opening profile for ${patient.name}`)
      }>
      <Card style={styles.cardPadding}>
        {/* Main row */}
        <View style={styles.cardRow}>
          {/* Avatar */}
          <Avatar name={patient.name} size={44} style={styles.avatar} />

          {/* Centre info */}
          <View style={styles.cardCenter}>
            <AppText variant="subheading">{patient.name}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {patient.condition}
            </AppText>
            <AppText variant="caption" color={colors.primary}>
              {patient.nextSession}
            </AppText>
          </View>

          {/* Right: badge + progress */}
          <View style={styles.cardRight}>
            <Badge
              label={patient.status}
              variant={statusVariant(patient.status)}
            />
            <View style={styles.progressPill}>
              <AppText variant="caption" color={colors.textMuted}>
                {progressText}
              </AppText>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Therapist row */}
        <AppText variant="caption" color={colors.textMuted}>
          {patient.therapist}
        </AppText>
      </Card>
    </Pressable>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <AppText variant="body" color={colors.textMuted}>
        No patients found
      </AppText>
    </View>
  );
}

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockPatients.filter(p => {
      const matchesFilter =
        activeFilter === 'All' || p.status === activeFilter;
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <View style={styles.container}>
      <BackTopTab screenName="Patients" />
      <View style={styles.body}>
        {/* Search bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}>
          {FILTERS.map(filter => {
            const selected = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.chip,
                  selected ? styles.chipSelected : styles.chipUnselected,
                ]}>
                <AppText
                  variant="label"
                  color={selected ? colors.white : colors.textMuted}>
                  {filter}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Patient count */}
        <AppText variant="caption" color={colors.textMuted} style={styles.count}>
          {filteredPatients.length}{' '}
          {filteredPatients.length === 1 ? 'patient' : 'patients'}
        </AppText>

        {/* Patient list */}
        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id}
          renderItem={({item}) => <PatientCard patient={item} />}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyState}
        />
      </View>
    </View>
  );
}

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
  header: {
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersContainer: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  count: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  separator: {
    height: spacing.sm,
  },
  cardPadding: {
    padding: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  cardCenter: {
    flex: 1,
    gap: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  progressPill: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
});
