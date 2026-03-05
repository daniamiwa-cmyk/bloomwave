import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

export default function CompleteScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loadProfile } = useAuthStore();
  const params = useLocalSearchParams<{
    name: string;
    pronouns: string;
    boundary_preset: string;
    preferred_tone: string;
    humor_style: string;
    comfort_style: string;
  }>();

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post('/api/v1/profile/onboarding', {
        display_name: params.name,
        pronouns: params.pronouns,
        boundary_preset: params.boundary_preset,
        preferred_tone: params.preferred_tone,
        humor_style: params.humor_style,
        comfort_style: params.comfort_style,
      });

      // Create default thread
      await api.post('/api/v1/threads', {
        title: 'General',
        description: 'Your main conversation space',
        is_default: true,
      });

      await loadProfile();
      router.replace('/(main)/chat/');
    } catch (err) {
      console.error('Onboarding failed:', err);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.ready}>I'm ready.</Text>
        <Text style={styles.description}>
          I'll remember what you share with me.{'\n'}
          I'll notice what matters.{'\n'}
          And I'll always meet you where you are.
        </Text>
        <Text style={styles.note}>
          You're in control. You can see, edit, or{'\n'}
          delete anything I remember — anytime.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.textOnPrimary} />
        ) : (
          <Text style={styles.buttonText}>Start talking</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  ready: {
    ...typography.h1,
    fontSize: 40,
    lineHeight: 48,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  description: {
    ...typography.body,
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  note: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});
