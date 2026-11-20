import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardHeader from '@/components/common/DashboardHeader';
import {useAppSelector} from '@/app/store/hooks';
import apiClient from '@/services/api/apiClient';
import type {MainTabParamList} from '@/app/navigation/types';

interface AppointmentItem {
  id: string;
  time: string;
  type: string;
  patientName: string;
}

interface ActivePlanItem {
  id: string;
  patientName: string;
  therapyName: string;
  daysRemaining: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 20) / 3;

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const user = useAppSelector(state => state.session.user);

  const [refreshing, setRefreshing] = useState(false);
  const [patientCount, setPatientCount] = useState<number>(127);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  // Default appointments matching HealTrackPro
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'app-1',
      time: '13:30',
      type: 'In Clinic',
      patientName: 'Sandip K',
    },
  ]);

  // Default active plans matching HealTrackPro
  const [activePlans, setActivePlans] = useState<ActivePlanItem[]>([
    {
      id: 'plan-1',
      patientName: 'Sandip K',
      therapyName: 'Lbp',
      daysRemaining: 11,
      startDate: '11/18/2026',
      endDate: '11/30/2026',
      progressPercent: 25,
    },
    {
      id: 'plan-2',
      patientName: 'Diwan K C',
      therapyName: 'Lumbar support therapy',
      daysRemaining: 18,
      startDate: '11/15/2026',
      endDate: '12/05/2026',
      progressPercent: 40,
    },
  ]);

  const displayName = user?.name || 'Suraj Mujawar';
  const qualification = user?.organizationIndustry || 'mbbs';
  const clinicName = user?.organization || 'HealTrack clinic';
  const email = user?.email || 'surajsm0709@gmail.com';
  const photoUri = user?.doctorPhoto;

  const loadData = useCallback(async () => {
    try {
      // 1. Patient count
      const countRes = await apiClient.get('/patient/getAllMy/count');
      if (countRes.data?.totalPatients !== undefined) {
        setPatientCount(countRes.data.totalPatients);
      }
    } catch {
      // Gracefully retain current patient count
    }

    try {
      // 2. Appointments
      const apptRes = await apiClient.get('/appointments/getevents');
      const rawAppointments = apptRes.data?.appointments;
      if (Array.isArray(rawAppointments) && rawAppointments.length > 0) {
        setAppointments(
          rawAppointments.map((a: any, idx: number) => ({
            id: a._id || `appt-${idx}`,
            time: a.therepy_start_time || '13:30',
            type: a.therepy_type || 'In Clinic',
            patientName: a.patient_name || 'Patient',
          })),
        );
      }
    } catch {
      // Gracefully retain current appointments
    }

    try {
      // 3. Active Plans
      const plansRes = await apiClient.get('/get/active/plans');
      const rawPlans = plansRes.data?.active_plans;
      if (Array.isArray(rawPlans) && rawPlans.length > 0) {
        setActivePlans(
          rawPlans.map((p: any, idx: number) => {
            const start = new Date(p.therapy_start).getTime();
            const end = new Date(p.therapy_end).getTime();
            const now = Date.now();
            const total = Math.max(end - start, 1);
            const elapsed = Math.max(now - start, 0);
            const progress = Math.min(Math.round((elapsed / total) * 100), 100);

            return {
              id: p._id || `plan-${idx}`,
              patientName: p.patient_name || 'Patient',
              therapyName: p.therapy_name || 'Rehab Plan',
              daysRemaining: p.days_remaining ?? 10,
              startDate: new Date(p.therapy_start).toLocaleDateString(),
              endDate: new Date(p.therapy_end).toLocaleDateString(),
              progressPercent: progress,
            };
          }),
        );
      }
    } catch {
      // Gracefully retain current plans
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleAppointments = () => {
    setShowAllAppointments(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* ── Top Bar (Exact HealTrackPro Design) ── */}
      <DashboardHeader unreadNotificationCount={2} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }>
        {/* ── Doctor Hero Profile Section (Curved #1E1E1E card) ── */}
        <View style={styles.heroSection}>
          <View style={styles.heroRow}>
            {/* Doctor Photo */}
            <View style={styles.photoContainer}>
              {photoUri ? (
                <Image source={{uri: photoUri}} style={styles.doctorPhoto} />
              ) : (
                <Image
                  source={require('@/assets/profile.png')}
                  style={styles.doctorPhoto}
                />
              )}
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>{displayName}</Text>
              <Text style={styles.qualification}>{qualification}</Text>
              <Text style={styles.clinicName}>{clinicName}</Text>

              <View style={styles.detailRow}>
                <Icon name="email-outline" size={15} color="#007B8E" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {email}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="phone-outline" size={15} color="#007B8E" />
                <Text style={styles.detailText}>+91 9145168279</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Stats Pill Badge (Exact HealTrackPro Styling) ── */}
        <View style={styles.statsPill}>
          <TouchableOpacity
            style={styles.statPillItem}
            onPress={() => navigation.navigate('SearchPatients')}>
            <Text style={styles.statPillNumber}>{patientCount}</Text>
            <Text style={styles.statPillLabel}>My Patients</Text>
          </TouchableOpacity>
          <View style={styles.statPillDivider} />
          <TouchableOpacity
            style={styles.statPillItem}
            onPress={() => navigation.navigate('Appointments')}>
            <Text style={styles.statPillNumber}>{appointments.length}</Text>
            <Text style={styles.statPillLabel}>
              {appointments.length === 1 ? 'Appointment' : 'Appointments'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Management Section (3 Cards) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.managementGrid}>
            {/* Card 1: All Doctors */}
            <TouchableOpacity
              style={styles.managementCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SearchPatients')}>
              <Icon name="doctor" size={32} color="#007B8E" />
              <Text style={styles.managementCardText}>All Doctors</Text>
            </TouchableOpacity>

            {/* Card 2: View Patients */}
            <TouchableOpacity
              style={styles.managementCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SearchPatients')}>
              <Icon name="format-list-bulleted" size={32} color="#007B8E" />
              <Text style={styles.managementCardText}>View Patients</Text>
            </TouchableOpacity>

            {/* Card 3: Add Doctor / Patient */}
            <TouchableOpacity
              style={styles.managementCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddPatient')}>
              <Icon name="plus-circle-outline" size={32} color="#007B8E" />
              <Text style={styles.managementCardText}>Add Doctor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── My Appointment Section ── */}
        <View style={styles.section}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.sectionTitle}>
              {showAllAppointments ? 'All Appointments' : 'My Appointment'}
            </Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleAppointments}
              activeOpacity={0.8}>
              <Text style={styles.toggleButtonText}>
                {showAllAppointments ? 'My Appointment' : 'All Appointments'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.dateText}>{getFormattedDate()}</Text>

          {appointments.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.appointmentCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Appointments')}>
              <View style={styles.appointmentIconBox}>
                <Icon name="stethoscope" size={24} color="#007B8E" />
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTime}>{item.time}</Text>
                <Text style={styles.appointmentType}>{item.type}</Text>
              </View>
              <Text style={styles.patientName}>{item.patientName}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Active Plans Section ── */}
        <View style={styles.section}>
          <View style={styles.activePlansHeader}>
            <Text style={styles.sectionTitle}>Active Plans</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.refreshIconBtn}>
              <Icon name="refresh" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {activePlans.map(plan => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planCardHeader}>
                <Icon
                  name="flower-tulip-outline"
                  size={24}
                  color="#007B8E"
                  style={styles.planIcon}
                />
                <View style={styles.planInfo}>
                  <Text style={styles.planPatientName}>{plan.patientName}</Text>
                  <Text style={styles.planTherapyName}>{plan.therapyName}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {width: `${plan.progressPercent}%`},
                    ]}
                  />
                </View>
                <Text style={styles.daysRemainingText}>
                  {plan.daysRemaining > 0
                    ? `${plan.daysRemaining} days remaining`
                    : 'Completed'}
                </Text>
              </View>

              {/* Start & End Dates */}
              <View style={styles.planDatesRow}>
                <Text style={styles.planDateText}>
                  Start: {plan.startDate}
                </Text>
                <Text style={styles.planDateText}>End: {plan.endDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#007B8E',
  },
  scrollContent: {
    paddingBottom: 48,
  },

  /* ── Hero Profile Section ── */
  heroSection: {
    backgroundColor: '#1E1E1E',
    borderBottomRightRadius: 150,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    marginRight: 16,
  },
  doctorPhoto: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#007B8E',
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  qualification: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  clinicName: {
    fontSize: 15,
    color: '#007B8E',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },

  /* ── Stats Pill Badge ── */
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#119FB3',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: -20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statPillItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statPillDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
  },
  statPillNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1311',
  },
  statPillLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F1311',
    opacity: 0.8,
  },

  /* ── Sections ── */
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  /* ── Management Section (3 Cards) ── */
  managementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  managementCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  managementCardText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  /* ── My Appointment Section ── */
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appointmentType: {
    fontSize: 13,
    color: '#9A9C9A',
    marginTop: 2,
  },
  patientName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  /* ── Active Plans Section ── */
  activePlansHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshIconBtn: {
    padding: 4,
  },
  planCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  planIcon: {
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planTherapyName: {
    fontSize: 13,
    color: '#9A9C9A',
    marginTop: 2,
  },
  progressContainer: {
    marginVertical: 6,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007B8E',
    borderRadius: 2,
  },
  daysRemainingText: {
    fontSize: 12,
    color: '#9A9C9A',
    marginTop: 4,
  },
  planDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  planDateText: {
    fontSize: 12,
    color: '#9A9C9A',
  },
});
