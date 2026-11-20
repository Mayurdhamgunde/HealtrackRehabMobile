import type {TextStyle} from 'react-native';

export const typography = {
  title: {fontSize: 26, lineHeight: 32, fontWeight: '700'},
  heading: {fontSize: 18, lineHeight: 24, fontWeight: '700'},
  subheading: {fontSize: 16, lineHeight: 22, fontWeight: '600'},
  body: {fontSize: 15, lineHeight: 22, fontWeight: '400'},
  label: {fontSize: 13, lineHeight: 18, fontWeight: '600'},
  caption: {fontSize: 12, lineHeight: 16, fontWeight: '400'},
} satisfies Record<string, TextStyle>;