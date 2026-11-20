import React, {useState} from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch, useAppSelector} from '@/app/store/hooks';
import {signedOut} from '@/app/store/sessionSlice';
import {logout} from '@/features/auth/api/authRepository';

interface Props {
  unreadNotificationCount?: number;
  onNotificationPress?: () => void;
}

export default function DashboardHeader({
  unreadNotificationCount = 0,
  onNotificationPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.session.user);
  const {width} = useWindowDimensions();

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(prev => !prev);

  const navigateToTab = (tabName: string) => {
    setDropdownVisible(false);
    navigation.navigate(tabName);
  };

  const handleLogout = async () => {
    setDropdownVisible(false);
    await logout();
    dispatch(signedOut());
  };

  const displayName = user?.name || 'Staff User';
  const roleName = user?.isAdmin ? 'Admin' : 'Staff';
  const photoUri = user?.doctorPhoto;

  return (
    <View style={styles.wrapper}>
      {/* Black Status Bar background */}
      <View style={[styles.topInset, {height: insets.top}]} />

      <StatusBar
        barStyle="light-content"
        {...({
          backgroundColor: '#000000',
          translucent: Platform.OS === 'android',
        } as any)}
      />

      {/* ── Main Top Bar ── */}
      <View style={styles.dashboardHeader}>
        {/* Left: Logo + Version */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/healtrack_logo1.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.versionText}>v0.8</Text>
        </View>

        {/* Right: Notifications + Hamburger Menu */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="bell-outline" size={24} color="#FFFFFF" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotificationCount > 99
                    ? '99+'
                    : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleDropdown}
            activeOpacity={0.7}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="menu" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Slide-in Drawer Modal ── */}
      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleDropdown}>
        <View style={styles.modalOverlay}>
          {/* Backdrop */}
          <Pressable style={styles.backdrop} onPress={toggleDropdown} />

          {/* Drawer content sliding from the right */}
          <View style={[styles.sidebar, {width: width * 0.76}]}>
            {/* Header: Avatar, Name, Role, Close */}
            <View style={styles.sidebarHeader}>
              <View style={styles.userInfo}>
                {photoUri ? (
                  <Image source={{uri: photoUri}} style={styles.sidebarAvatar} />
                ) : (
                  <Image
                    source={require('@/assets/profile.png')}
                    style={styles.sidebarAvatar}
                  />
                )}
                <View style={styles.userDetails}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text style={styles.userRole}>{roleName}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={toggleDropdown}
                style={styles.closeBtn}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="close" size={24} color="#1E1E1E" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuContainer}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('Patients')}>
                <Icon
                  name="account-group-outline"
                  size={22}
                  color="#007B8E"
                />
                <Text style={styles.drawerItemText}>All Patients</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('Dashboard')}>
                <Icon
                  name="view-dashboard-outline"
                  size={22}
                  color="#007B8E"
                />
                <Text style={styles.drawerItemText}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('Appointments')}>
                <Icon
                  name="calendar-clock-outline"
                  size={22}
                  color="#007B8E"
                />
                <Text style={styles.drawerItemText}>Appointments</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('More')}>
                <Icon name="cog-outline" size={22} color="#007B8E" />
                <Text style={styles.drawerItemText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('More')}>
                <Icon
                  name="file-document-outline"
                  size={22}
                  color="#007B8E"
                />
                <Text style={styles.drawerItemText}>Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigateToTab('More')}>
                <Icon name="map-marker-outline" size={22} color="#007B8E" />
                <Text style={styles.drawerItemText}>Location</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Bottom Log Out Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={handleLogout}>
                <Icon name="logout" size={22} color="#FF3B30" />
                <Text style={[styles.drawerItemText, styles.logoutText]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1000,
  },
  topInset: {
    backgroundColor: '#000000',
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007B8E',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    borderTopColor: '#FFFFFF',
    borderTopWidth: 1,
  },
  logoContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 35,
  },
  versionText: {
    position: 'absolute',
    bottom: 1,
    right: -12,
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuButton: {
    alignItems: 'flex-end',
  },

  /* ── Drawer Modal ── */
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {width: -5, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 6,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sidebarAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  userRole: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    marginHorizontal: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  drawerItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E1E1E',
    marginLeft: 14,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 'auto',
  },
  logoutText: {
    color: '#FF3B30',
  },
});
