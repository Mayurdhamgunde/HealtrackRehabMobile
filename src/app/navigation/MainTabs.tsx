import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '@/features/dashboard/screens/HomeScreen';
import AppointmentsScreen from '@/features/appointments/screens/AppointmentsScreen';
import PatientsScreen from '@/features/patients/screens/PatientsScreen';
import AddPatientScreen from '@/features/patients/screens/AddPatientScreen';
import ConnectScreen from '@/features/connect/screens/ConnectScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import type {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  color: string;
  size: number;
  focused: boolean;
}

function HomeTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'home' : 'home-outline'}
      size={26}
      color={color}
    />
  );
}

function AppointmentsTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'calendar-month' : 'calendar-month-outline'}
      size={24}
      color={color}
    />
  );
}

function SearchTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'magnify' : 'magnify'}
      size={26}
      color={color}
    />
  );
}

function AddPatientTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'account-plus' : 'account-plus-outline'}
      size={24}
      color={color}
    />
  );
}

function ConnectTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'comment-text-multiple' : 'comment-text-multiple-outline'}
      size={24}
      color={color}
    />
  );
}

function ProfileTabIcon({color, focused}: TabIconProps) {
  return (
    <Icon
      name={focused ? 'account-circle' : 'account-circle-outline'}
      size={28}
      color={color}
    />
  );
}

function HealTrackTabBar({state, descriptors, navigation, insets}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* ── White Tab Bar (Exact 60dp height with 6 evenly spaced icons) ── */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? '#007B8E' : '#8E8E93',
                size: 26,
              })}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Solid Black Navigation Bar Area for Android / Safe Area for iOS ── */}
      {insets.bottom > 0 && (
        <View
          style={[
            styles.bottomInsetSpacer,
            {height: insets.bottom},
            Platform.OS === 'ios' ? styles.iosInsetBg : styles.androidInsetBg,
          ]}
        />
      )}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      backBehavior="history"
      tabBar={HealTrackTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      {/* 1. Home / Dashboard */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: HomeTabIcon,
        }}
      />

      {/* 2. Appointments / Calendar */}
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: AppointmentsTabIcon,
        }}
      />

      {/* 3. Search / All Patients */}
      <Tab.Screen
        name="SearchPatients"
        component={PatientsScreen}
        options={{
          tabBarIcon: SearchTabIcon,
        }}
      />

      {/* 4. Add Patient */}
      <Tab.Screen
        name="AddPatient"
        component={AddPatientScreen}
        options={{
          tabBarIcon: AddPatientTabIcon,
        }}
      />

      {/* 5. Connect / Teleconsultation & Chat */}
      <Tab.Screen
        name="Connect"
        component={ConnectScreen}
        options={{
          tabBarIcon: ConnectTabIcon,
        }}
      />

      {/* 6. Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  tabRow: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: -2},
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomInsetSpacer: {
    width: '100%',
  },
  iosInsetBg: {
    backgroundColor: '#FFFFFF',
  },
  androidInsetBg: {
    backgroundColor: '#000000',
  },
});
