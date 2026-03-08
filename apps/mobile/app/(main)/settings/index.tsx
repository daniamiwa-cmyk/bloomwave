import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/theme/ThemeProvider';
import { api } from '@/services/api';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress: () => void;
  color?: string;
  danger?: boolean;
}

function SettingsRow({ icon, label, description, onPress, color, danger }: SettingsRowProps) {
  const colors = useTheme();
  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.error : color || colors.textSecondary}
      />
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: colors.text }, danger && { color: colors.error }]}>{label}</Text>
        {description && <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { profile, signOut } = useAuthStore();
  const colors = useTheme();
  const router = useRouter();

  const handleToggleMemory = async () => {
    const paused = profile?.memory_paused;
    Alert.alert(
      paused ? 'Resume memory?' : 'Pause memory?',
      paused
        ? "I'll start remembering our conversations again."
        : "I'll stop saving new memories until you turn this back on. Existing memories are kept.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: paused ? 'Resume' : 'Pause',
          onPress: async () => {
            try {
              await api.post('/api/v1/profile/memory-pause');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not update memory setting');
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently deletes ALL your data — messages, memories, threads, everything. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'Last chance. All data will be gone immediately.',
              [
                { text: 'Keep my account', style: 'cancel' },
                {
                  text: 'Delete permanently',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await api.delete('/api/v1/profile/account');
                      signOut();
                    } catch (err: any) {
                      Alert.alert('Error', err.message || 'Could not delete account. Please try again.');
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PROFILE</Text>
          <SettingsRow
            icon="person-outline"
            label={profile?.display_name || 'Profile'}
            description={`${profile?.pronouns || ''} \u00b7 ${profile?.boundary_preset?.replace(/_/g, ' ') || ''}`}
            onPress={() => router.push('/(main)/settings/profile')}
          />
          <SettingsRow
            icon={profile?.interaction_mode === 'fantasy' ? 'flame-outline' : 'leaf-outline'}
            label={`Mode: ${profile?.interaction_mode === 'fantasy' ? 'Fantasy' : 'Relational'}`}
            description="Change how Amaia shows up for you"
            onPress={() => router.push('/(main)/settings/mode')}
            color={profile?.interaction_mode === 'fantasy' ? '#E53935' : colors.primary}
          />
          <SettingsRow
            icon="color-palette-outline"
            label="Appearance"
            description="Accent color & background theme"
            onPress={() => router.push('/(main)/settings/appearance')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PRIVACY & DATA</Text>
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy"
            description="See what data Amaia stores"
            onPress={() => router.push('/(main)/settings/privacy')}
          />
          <SettingsRow
            icon={profile?.memory_paused ? 'play-outline' : 'pause-outline'}
            label={profile?.memory_paused ? 'Resume memory' : 'Pause memory'}
            description={
              profile?.memory_paused
                ? 'Memory is paused — I am not saving new memories'
                : "I'm currently remembering our conversations"
            }
            onPress={handleToggleMemory}
            color={profile?.memory_paused ? colors.warning : undefined}
          />
          <SettingsRow
            icon="trash-outline"
            label="Delete all memories"
            description="Remove everything I remember"
            onPress={() =>
              Alert.alert('Delete all memories?', 'This removes all saved memories.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete all',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await api.delete('/api/v1/memories');
                    } catch (err: any) {
                      Alert.alert('Error', err.message || 'Could not delete memories');
                    }
                  },
                },
              ])
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>COMMUNITY</Text>
          <SettingsRow
            icon="sparkles-outline"
            label="Request a Persona"
            description="Suggest a persona you'd like to see"
            onPress={() => router.push('/(main)/settings/request-persona')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SUPPORT</Text>
          <SettingsRow
            icon="heart-outline"
            label="Crisis Resources"
            description="Helplines and support if you're in crisis"
            onPress={() =>
              Alert.alert(
                'Crisis Resources',
                'If you or someone you know is in crisis:\n\n988 Suicide & Crisis Lifeline\nCall or text 988\n\nCrisis Text Line\nText HOME to 741741\n\nThese services are free, confidential, and available 24/7.',
                [
                  { text: 'Call 988', onPress: () => Linking.openURL('tel:988') },
                  { text: 'Close', style: 'cancel' },
                ],
              )
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
          {Platform.OS === 'ios' && (
            <SettingsRow
              icon="card-outline"
              label="Manage Subscriptions"
              description="View and manage in the App Store"
              onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}
            />
          )}
          <SettingsRow
            icon="log-out-outline"
            label="Sign out"
            onPress={() =>
              Alert.alert('Sign out?', undefined, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign out', onPress: signOut },
              ])
            }
          />
          <SettingsRow
            icon="warning-outline"
            label="Delete account"
            description="Permanently delete your account and all data"
            onPress={handleDeleteAccount}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    letterSpacing: 1.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    ...typography.body,
  },
  rowDesc: {
    ...typography.caption,
    marginTop: 2,
  },
});
