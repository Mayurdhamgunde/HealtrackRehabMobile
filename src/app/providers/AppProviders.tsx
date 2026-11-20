import React from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from '@/app/store/store';

export default function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </Provider>
  );
}