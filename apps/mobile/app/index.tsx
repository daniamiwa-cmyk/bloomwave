import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/theme/colors';

export default function Index() {
  const { isAuthenticated, isLoading, profile } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!profile?.onboarding_completed) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(main)/chat/" />;
}
