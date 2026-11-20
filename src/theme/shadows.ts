import {Platform} from 'react-native';

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#0B2A33',
      shadowOpacity: 0.07,
      shadowRadius: 6,
      shadowOffset: {width: 0, height: 2},
    },
    android: {elevation: 2},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#0B2A33',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 4},
    },
    android: {elevation: 4},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#0B2A33',
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: {width: 0, height: 6},
    },
    android: {elevation: 8},
  }),
} as const;
