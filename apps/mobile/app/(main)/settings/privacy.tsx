import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const { profile } = useAuthStore();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Data</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Your privacy is fundamental to Amaia. Here's exactly what we store, where,
          and what you can do about it.
        </Text>

        <Section title="What data Amaia stores">
          <Bullet text="Your name, pronouns, and preferences (what you set during onboarding)" />
          <Bullet text="Your messages and Amaia's responses" />
          <Bullet text="Memories extracted from conversations (summaries, not raw messages)" />
          <Bullet text="Thread names and descriptions you create" />
          <Bullet text="Check-in schedules" />
          <Bullet text="Your date of birth (for age-gated features only — never shared)" />
          <Bullet text="Your email address (for sign-in only)" />
          <Bullet text="Purchase history (managed by Apple, verified via RevenueCat)" />
        </Section>

        <Section title="Where it's stored">
          <Bullet text="All data is stored in Supabase (encrypted at rest and in transit)" />
          <Bullet text="Your messages are sent to Anthropic's Claude API for responses — they do NOT store or train on API data" />
          <Bullet text="Memory embeddings (mathematical representations) are stored for search — they cannot be reversed into your original text" />
          <Bullet text="No data is shared with advertisers or third parties" />
        </Section>

        <Section title="What Amaia does NOT do">
          <Bullet text="No tracking or analytics" />
          <Bullet text="No advertising SDKs" />
          <Bullet text="No selling or sharing your data" />
          <Bullet text="No training AI models on your conversations" />
          <Bullet text="No reading your contacts, photos, or other apps" />
        </Section>

        <Section title="Your controls">
          <View style={styles.controlCard}>
            <Ionicons name="eye-outline" size={20} color={colors.primary} />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>View all memories</Text>
              <Text style={styles.controlDesc}>See everything Amaia remembers in the Memories tab</Text>
            </View>
          </View>

          <View style={styles.controlCard}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Edit any memory</Text>
              <Text style={styles.controlDesc}>Correct or update what Amaia remembers</Text>
            </View>
          </View>

          <View style={styles.controlCard}>
            <Ionicons name="trash-outline" size={20} color={colors.primary} />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Delete memories</Text>
              <Text style={styles.controlDesc}>Remove individual memories or delete them all</Text>
            </View>
          </View>

          <View style={styles.controlCard}>
            <Ionicons
              name={profile?.memory_paused ? 'play-outline' : 'pause-outline'}
              size={20}
              color={profile?.memory_paused ? colors.warning : colors.primary}
            />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>
                Memory is {profile?.memory_paused ? 'paused' : 'active'}
              </Text>
              <Text style={styles.controlDesc}>
                {profile?.memory_paused
                  ? 'Amaia is not saving new memories right now'
                  : 'Amaia saves meaningful moments from your conversations'}
              </Text>
            </View>
          </View>

          <View style={styles.controlCard}>
            <Ionicons name="person-remove-outline" size={20} color={colors.error} />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Delete your account</Text>
              <Text style={styles.controlDesc}>
                Permanently removes ALL data — messages, memories, everything. Available in Settings.
              </Text>
            </View>
          </View>
        </Section>

        <TouchableOpacity
          style={styles.policyLink}
          onPress={() => Linking.openURL('https://amaia.app/privacy')}
        >
          <Text style={styles.policyLinkText}>Read full privacy policy</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.policyLink}
          onPress={() => Linking.openURL('https://amaia.app/terms')}
        >
          <Text style={styles.policyLinkText}>Terms of Service</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingRight: spacing.md,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  bulletText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  controlCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  controlInfo: {
    flex: 1,
  },
  controlTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  controlDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  policyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  policyLinkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
