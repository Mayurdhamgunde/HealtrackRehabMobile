import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@/constants/config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve auth token:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Token expired or invalid
        await Promise.all([
          AsyncStorage.removeItem('userToken'),
          AsyncStorage.removeItem('userProfile'),
        ]);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
