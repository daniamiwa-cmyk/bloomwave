import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';

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

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
