import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
          Privacy Policy — Amaia Chat App{'\n'}
          Last updated: February 20, 2026
        </Text>

        <Section title="Data We Collect">
          <Bullet text="Email address (for account creation)" />
        </Section>

        <Section title="How We Use Your Data">
          <Bullet text="To provide and sync your journal and coaching sessions across devices" />
          <Bullet text="We do not sell your data to third parties" />
        </Section>

        <Section title="Third Party Services">
          <Bullet text="Supabase (data storage and authentication)" />
          <Bullet text="RevenueCat (subscription management)" />
          <Bullet text="Anthropic (AI coaching responses)" />
        </Section>

        <Section title="Data Deletion">
          <View style={styles.controlCard}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <View style={styles.controlInfo}>
              <Text style={styles.controlTitle}>Delete your account</Text>
              <Text style={styles.controlDesc}>
                Hit the delete button in Settings, or contact us at chibijumpstore@gmail.com
              </Text>
            </View>
          </View>
        </Section>

        <Section title="Contact">
          <TouchableOpacity onPress={() => Linking.openURL('mailto:chibijumpstore@gmail.com')}>
            <Text style={[styles.bulletText, { color: colors.primary }]}>chibijumpstore@gmail.com</Text>
          </TouchableOpacity>
        </Section>

        <TouchableOpacity
          style={styles.policyLink}
          onPress={() => Linking.openURL('https://docs.google.com/document/d/1SiR-1JiE11SpT1VzezFJbWFE_2yAKI5x-xvVtOmzQgw/edit?usp=sharing')}
        >
          <Text style={styles.policyLinkText}>Read full privacy policy</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.policyLink}
          onPress={() => Linking.openURL('https://docs.google.com/document/d/1SiR-1JiE11SpT1VzezFJbWFE_2yAKI5x-xvVtOmzQgw/edit?usp=sharing')}
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
