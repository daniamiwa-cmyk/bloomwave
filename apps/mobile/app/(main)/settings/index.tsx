import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { colors } from '@/theme/colors';
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
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={danger ? colors.error : color || colors.textSecondary}
      />
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && { color: colors.error }]}>{label}</Text>
        {description && <Text style={styles.rowDesc}>{description}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { profile, signOut } = useAuthStore();
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
          onPress: () => api.post('/api/v1/profile/memory-pause'),
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
                    await api.delete('/api/v1/profile/account');
                    signOut();
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PROFILE</Text>
          <SettingsRow
            icon="person-outline"
            label={profile?.display_name || 'Profile'}
            description={`${profile?.pronouns || ''} \u00b7 ${profile?.boundary_preset?.replace(/_/g, ' ') || ''}`}
            onPress={() => {}}
          />
          <SettingsRow
            icon={profile?.interaction_mode === 'fantasy' ? 'flame-outline' : 'leaf-outline'}
            label={`Mode: ${profile?.interaction_mode === 'fantasy' ? 'Fantasy' : 'Relational'}`}
            description="Change how Alora shows up for you"
            onPress={() => router.push('/(main)/settings/mode')}
            color={profile?.interaction_mode === 'fantasy' ? '#E53935' : colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRIVACY & DATA</Text>
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy"
            description="See what data Alora stores"
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
                  onPress: () => api.delete('/api/v1/memories'),
                },
              ])
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GEMS</Text>
          <SettingsRow
            icon="diamond-outline"
            label={`${profile?.gems || 0} gems`}
            description="Get more gems to keep chatting"
            onPress={() => router.push('/(main)/settings/gems')}
            color={colors.gem}
          />
          <SettingsRow
            icon="gift-outline"
            label="Claim daily gems"
            description="10 free gems every day"
            onPress={async () => {
              const result = await api.post<{ claimed: boolean; balance: number }>(
                '/api/v1/gems/daily',
              );
              if (result.claimed) {
                Alert.alert('Daily gems claimed!', `You now have ${result.balance} gems.`);
              } else {
                Alert.alert('Already claimed', "Come back tomorrow for more gems.");
              }
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
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
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text,
  },
  rowDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
