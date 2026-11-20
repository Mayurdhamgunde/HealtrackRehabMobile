import AsyncStorage from '@react-native-async-storage/async-storage';
import {USE_MOCKS} from '@/constants/config';
import apiClient from '@/services/api/apiClient';
import {mockLogin} from '../mock/mockAuth';
import type {DoctorLoginResponse, LoginCredentials, SessionUser} from '../types';

function mapDoctorResponseToUser(
  data: DoctorLoginResponse,
  fallbackEmail: string,
): SessionUser {
  const firstName = data.doctor_first_name || '';
  const lastName = data.doctor_last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || fallbackEmail;

  return {
    id: data.doctor_id || 'doctor',
    name: fullName,
    email: fallbackEmail,
    isAdmin: Boolean(data.is_admin),
    organization: data.organization_industry || 'Rehabilitation Centre',
    token: data.token,
    doctorFirstName: data.doctor_first_name,
    doctorLastName: data.doctor_last_name,
    doctorPhoto: data.doctor_photo,
    organizationIndustry: data.organization_industry,
    hasAccessToken: data.has_access_token,
    organizationLocation: data.organization_location,
  };
}

async function persistSession(data: DoctorLoginResponse): Promise<void> {
  if (data.token) {
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userProfile', JSON.stringify(data));
  }
}

/* ── Password Login (matches /verify/password in DoctorHealtrackai) ── */
export async function login(credentials: LoginCredentials): Promise<SessionUser> {
  if (USE_MOCKS) {
    return mockLogin(credentials);
  }

  const email = credentials.email.toLowerCase().trim();
  const response = await apiClient.post<DoctorLoginResponse>('/verify/password', {
    email,
    password: credentials.password,
  });

  const data = response.data;
  if (!data?.token) {
    throw new Error(data?.message || 'Invalid credentials or login failed.');
  }

  await persistSession(data);
  return mapDoctorResponseToUser(data, email);
}

/* ── Request OTP (matches /sendOtp in DoctorHealtrackai) ── */
export async function requestOtp(email: string): Promise<string> {
  if (USE_MOCKS) {
    return 'Mock OTP sent successfully.';
  }

  const lowerCaseEmail = email.toLowerCase().trim();
  const response = await apiClient.post<{message?: string}>('/sendOtp', {
    email: lowerCaseEmail,
  });

  return response.data?.message || 'OTP sent successfully.';
}

/* ── Verify OTP (matches /otpVerify in DoctorHealtrackai) ── */
export async function verifyOtpLogin(email: string, otp: string): Promise<SessionUser> {
  if (USE_MOCKS) {
    const isAdmin = email.toLowerCase().startsWith('admin');
    return {
      id: 'mock-user-001',
      name: isAdmin ? 'Admin Demo' : 'Dr. Demo Staff',
      email: email.toLowerCase().trim(),
      isAdmin,
      organization: 'Demo Rehabilitation Centre',
    };
  }

  const lowerCaseEmail = email.toLowerCase().trim();
  const response = await apiClient.post<DoctorLoginResponse>('/otpVerify', {
    email: lowerCaseEmail,
    otp: otp.trim(),
  });

  const data = response.data;
  if (!data?.token) {
    throw new Error(data?.message || 'Invalid OTP code.');
  }

  await persistSession(data);
  return mapDoctorResponseToUser(data, lowerCaseEmail);
}

/* ── Reset Password (matches /otpVerification/passwordsetup in DoctorHealtrackai) ── */
export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  password: string,
): Promise<string> {
  if (USE_MOCKS) {
    return 'Password reset successfully (demo).';
  }

  const lowerCaseEmail = email.toLowerCase().trim();
  const response = await apiClient.post<{message?: string}>(
    '/otpVerification/passwordsetup',
    {
      email: lowerCaseEmail,
      otp: otp.trim(),
      password,
    },
  );

  return response.data?.message || 'Password updated successfully.';
}

/* ── Restore Stored Session ── */
export async function getStoredSession(): Promise<SessionUser | null> {
  try {
    const [token, profileJson] = await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('userProfile'),
    ]);

    if (!token || !profileJson) {
      return null;
    }

    const data: DoctorLoginResponse = JSON.parse(profileJson);
    return mapDoctorResponseToUser(data, '');
  } catch (err) {
    console.warn('Failed to restore session:', err);
    return null;
  }
}

/* ── Sign Out ── */
export async function logout(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem('userToken'),
    AsyncStorage.removeItem('userProfile'),
  ]);
}
