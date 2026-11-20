import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {DefaultTheme, NavigationContainer, Theme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import {useAppDispatch, useAppSelector} from '@/app/store/hooks';
import {signedIn} from '@/app/store/sessionSlice';
import {getStoredSession} from '@/features/auth/api/authRepository';
import {colors} from '@/theme';
import MainTabs from './MainTabs';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.session.user);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await getStoredSession();
        if (stored && isMounted) {
          dispatch(signedIn(stored));
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (initializing) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#007b8e" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05181D',
  },
});