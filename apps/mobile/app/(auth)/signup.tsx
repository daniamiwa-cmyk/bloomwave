import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

function calculateAge(month: number, day: number, year: number): number {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email.trim() || !password) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const month = parseInt(birthMonth, 10);
    const day = parseInt(birthDay, 10);
    const year = parseInt(birthYear, 10);

    if (!month || !day || !year || month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
      setError('Please enter a valid date of birth');
      return;
    }

    // Validate actual calendar date (catches Feb 31, Jun 31, etc.)
    const testDate = new Date(year, month - 1, day);
    if (testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
      setError('Please enter a valid date of birth');
      return;
    }

    const age = calculateAge(month, day, year);
    if (age < 13) {
      setError('You must be at least 13 years old to use Amaia');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      // Store date of birth in profile for age-gated features
      try {
        const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        await api.patch('/api/v1/profile', {
          extended_profile: { date_of_birth: dob },
        });
      } catch {
        // Best-effort — will be asked again if needed
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your journey with Amaia</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Text style={styles.dobLabel}>Date of birth</Text>
          <View style={styles.dobRow}>
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="MM"
              placeholderTextColor={colors.textMuted}
              value={birthMonth}
              onChangeText={(t) => setBirthMonth(t.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="DD"
              placeholderTextColor={colors.textMuted}
              value={birthDay}
              onChangeText={(t) => setBirthDay(t.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.dobInputYear]}
              placeholder="YYYY"
              placeholderTextColor={colors.textMuted}
              value={birthYear}
              onChangeText={(t) => setBirthYear(t.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          <Text style={styles.dobHint}>You must be at least 13 to use Amaia</Text>

          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://docs.google.com/document/d/1SiR-1JiE11SpT1VzezFJbWFE_2yAKI5x-xvVtOmzQgw/edit?usp=sharing')}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://docs.google.com/document/d/1SiR-1JiE11SpT1VzezFJbWFE_2yAKI5x-xvVtOmzQgw/edit?usp=sharing')}>
              Privacy Policy
            </Text>
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.back()}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.body,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  dobLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dobRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dobInput: {
    flex: 1,
    textAlign: 'center',
  },
  dobInputYear: {
    flex: 1.5,
    textAlign: 'center',
  },
  dobHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  linkBold: {
    color: colors.primary,
    fontWeight: '600',
  },
  termsText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
