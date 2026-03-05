import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi there.</Text>
        <Text style={styles.name}>I'm Amaia.</Text>
        <Text style={styles.description}>
          I'm a companion who pays attention.{'\n'}
          I remember what matters to you,{'\n'}
          and I hold it gently.
        </Text>
        <Text style={styles.subtext}>
          Let me learn a little about you{'\n'}
          so I can show up the way you need.
        </Text>
        <Text style={styles.disclosure}>
          Amaia is an AI companion. Conversations are generated{'\n'}
          by artificial intelligence, not a real person.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(onboarding)/name-pronouns')}
      >
        <Text style={styles.buttonText}>Let's begin</Text>
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
  greeting: {
    ...typography.h1,
    fontSize: 36,
    lineHeight: 44,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h1,
    fontSize: 38,
    lineHeight: 46,
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
  subtext: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  disclosure: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});
