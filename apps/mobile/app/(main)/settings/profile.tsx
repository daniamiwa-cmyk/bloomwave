import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/theme/ThemeProvider';
import { api } from '@/services/api';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';

const TONE_OPTIONS = ['warm', 'playful', 'direct', 'gentle'] as const;
const HUMOR_OPTIONS = ['light', 'witty', 'dry', 'none'] as const;
const COMFORT_OPTIONS = [
  { value: 'validating', label: 'Validate my feelings' },
  { value: 'problem_solving', label: 'Help me problem-solve' },
  { value: 'just_listen', label: 'Just listen' },
] as const;

function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[] | readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const colors = useTheme();
  return (
    <View style={styles.chipRow}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const selected = value === val;
        return (
          <TouchableOpacity
            key={val}
            style={[
              styles.chip,
              { backgroundColor: colors.surface, borderColor: colors.border },
              selected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => onChange(val)}
          >
            <Text
              style={[
                styles.chipText,
                { color: colors.text },
                selected && styles.chipTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ProfileScreen() {
  const { profile, loadProfile } = useAuthStore();
  const colors = useTheme();
  const router = useRouter();

  const [name, setName] = useState(profile?.display_name || '');
  const [pronouns, setPronouns] = useState(profile?.pronouns || '');
  const [tone, setTone] = useState(profile?.preferred_tone || 'warm');
  const [humor, setHumor] = useState(profile?.humor_style || 'none');
  const [comfort, setComfort] = useState(profile?.comfort_style || 'validating');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/api/v1/profile', {
        display_name: name.trim(),
        pronouns: pronouns.trim(),
        preferred_tone: tone,
        humor_style: humor,
        comfort_style: comfort,
      });
      await loadProfile();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveText, { color: colors.primary }, saving && { opacity: 0.4 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Pronouns</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          value={pronouns}
          onChangeText={setPronouns}
          placeholder="e.g. she/her, he/him, they/them"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Preferred tone</Text>
        <ChipSelect
          options={TONE_OPTIONS}
          value={tone}
          onChange={setTone}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Humor style</Text>
        <ChipSelect
          options={HUMOR_OPTIONS}
          value={humor}
          onChange={setHumor}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>When I'm upset, I want you to...</Text>
        <ChipSelect
          options={COMFORT_OPTIONS}
          value={comfort}
          onChange={setComfort}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.h3,
  },
  saveText: {
    ...typography.body,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.body,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.bodySmall,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
