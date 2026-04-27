import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/stores/authStore';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { colors } from '@/theme/colors';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function RootLayout() {
  const { isAuthenticated, isLoading, profile, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !profile?.onboarding_completed && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isAuthenticated && profile?.onboarding_completed && (inAuth || inOnboarding)) {
      router.replace('/(main)/chat/');
    }
  }, [isAuthenticated, isLoading, profile?.onboarding_completed, segments]);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <LoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

