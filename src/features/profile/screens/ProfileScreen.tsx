import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackTopTab from '@/components/common/BackTopTab';
import {useAppDispatch, useAppSelector} from '@/app/store/hooks';
import {signedOut} from '@/app/store/sessionSlice';
import {logout} from '@/features/auth/api/authRepository';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.session.user);
  const [activeTab, setActiveTab] = useState<'About' | 'Blogs'>('About');

  const displayName = user?.name || 'Suraj Mujawar';
  const qualification = user?.organizationIndustry || 'mbbs';
  const clinicName = user?.organization || 'HealTrack clinic';
  const email = user?.email || 'surajsm0709@gmail.com';
  const photoUri = user?.doctorPhoto;

  const handleLogout = async () => {
    await logout();
    dispatch(signedOut());
  };

  return (
    <View style={styles.container}>
      <BackTopTab screenName="Profile" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {photoUri ? (
              <Image source={{uri: photoUri}} style={styles.avatarImage} />
            ) : (
              <Image
                source={require('@/assets/profile.png')}
                style={styles.avatarImage}
              />
            )}
          </View>

          <Text style={styles.doctorName}>{displayName}</Text>
          <Text style={styles.qualification}>{qualification}</Text>
          <Text style={styles.clinicName}>{clinicName}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Edit Profile', 'Profile editor coming soon.')}>
              <Text style={styles.actionBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Add Blog', 'Create new patient blog coming soon.')}>
              <Text style={styles.actionBtnText}>Add Blog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Buttons: About / Your Blogs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'About' && styles.tabButtonActive]}
            onPress={() => setActiveTab('About')}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'About' && styles.tabButtonTextActive,
              ]}>
              About
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Blogs' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Blogs')}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'Blogs' && styles.tabButtonTextActive,
              ]}>
              Your Blogs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="phone" size={20} color="#007B8E" />
            <Text style={styles.cardHeaderTitle}>Contact</Text>
          </View>
          <Text style={styles.contactItem}>+91 9145168279</Text>
          <Text style={styles.contactItem}>{email}</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="chart-bar" size={20} color="#007B8E" />
            <Text style={styles.cardHeaderTitle}>Statistics</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>127</Text>
              <Text style={styles.statLbl}>Patients</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statVal}>1</Text>
              <Text style={styles.statLbl}>Appointments</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statVal}>6</Text>
              <Text style={styles.statLbl}>Blogs</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLbl}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}>
          <Icon name="logout" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161C24',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#272D36',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#007B8E',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  qualification: {
    fontSize: 15,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  clinicName: {
    fontSize: 14,
    color: '#007B8E',
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    backgroundColor: '#007B8E',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#272D36',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#007B8E',
  },
  tabButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#272D36',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactItem: {
    fontSize: 15,
    color: '#CCCCCC',
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

