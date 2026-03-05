import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import { api } from '@/services/api';
import type { PersonaRequestResponse } from '@amai/shared';

const GENDER_OPTIONS = ['Male', 'Female', 'Nonbinary'];

const ARCHETYPE_OPTIONS = [
  'Protector', 'Muse', 'Trickster', 'Sage', 'Rebel',
  'Nurturer', 'Explorer', 'Lover', 'Healer', 'Provocateur',
];

export default function RequestPersonaScreen() {
  const colors = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [archetype, setArchetype] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && gender && archetype && description.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.post<PersonaRequestResponse>('/api/v1/persona-requests', {
        name: name.trim(),
        gender: gender.toLowerCase(),
        archetype: archetype.toLowerCase(),
        description: description.trim(),
      });
      Alert.alert('Thanks!', "We'll review your idea.", [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Oops', err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Request a Persona</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="What should they be called?"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            maxLength={40}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Gender</Text>
          <View style={styles.chips}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  gender === opt && { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
                ]}
                onPress={() => setGender(opt)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textSecondary },
                    gender === opt && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Archetype</Text>
          <View style={styles.chips}>
            {ARCHETYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  archetype === opt && { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
                ]}
                onPress={() => setArchetype(opt)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textSecondary },
                    archetype === opt && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Describe this persona's vibe, personality, backstory ideas..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              !canSubmit && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.buttonText, { color: colors.textOnPrimary }]}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    title: {
      ...typography.h3,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
      gap: spacing.xs,
    },
    label: {
      ...typography.caption,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 14,
      ...typography.body,
    },
    textArea: {
      minHeight: 120,
      paddingTop: 14,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    chip: {
      borderWidth: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    chipText: {
      ...typography.bodySmall,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    button: {
      borderRadius: radius.md,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.4,
    },
    buttonText: {
      ...typography.button,
    },
  });
