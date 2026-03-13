import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { CheckIn } from '@amai/shared';

export default function CheckInsScreen() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [topic, setTopic] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly'>('daily');
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('00');

  useEffect(() => {
    loadCheckins();
  }, []);

  const loadCheckins = async () => {
    try {
      const data = await api.get<{ checkins: CheckIn[] }>('/api/v1/checkins');
      setCheckins(data.checkins);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not load check-ins');
    }
  };

  const handleCreate = async () => {
    if (!topic.trim()) return;

    const now = new Date();
    const scheduled = new Date(now);
    scheduled.setHours(parseInt(hour), parseInt(minute), 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    const cronMap: Record<string, string> = {
      daily: `${minute} ${hour} * * *`,
      weekly: `${minute} ${hour} * * 1`,
      once: '',
    };

    try {
      await api.post('/api/v1/checkins', {
        topic: topic.trim(),
        frequency,
        scheduled_at: scheduled.toISOString(),
        cron_expression: cronMap[frequency] || null,
      });
      setTopic('');
      setShowCreate(false);
      loadCheckins();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCancel = async (id: string) => {
    Alert.alert('Cancel check-in?', 'This will stop future reminders.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel it',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/api/v1/checkins/${id}`);
          setCheckins((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const renderCheckin = ({ item }: { item: CheckIn }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="notifications-outline" size={18} color={colors.primary} />
        <Text style={styles.cardTopic}>{item.topic}</Text>
        <TouchableOpacity onPress={() => handleCancel(item.id)}>
          <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.metaText}>
          {item.frequency === 'once' ? 'One time' : item.frequency} at{' '}
          {formatTime(item.scheduled_at)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? colors.success + '20' : colors.textMuted + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'active' ? colors.success : colors.textMuted },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
      {item.times_triggered > 0 && (
        <Text style={styles.triggeredText}>
          Triggered {item.times_triggered} time{item.times_triggered > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Check-ins</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreate(!showCreate)}
        >
          <Ionicons name={showCreate ? 'close' : 'add'} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Gentle nudges to help you follow through on what matters.
      </Text>

      {showCreate && (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder="What should I check in about?"
            placeholderTextColor={colors.textMuted}
            value={topic}
            onChangeText={setTopic}
            autoFocus
          />

          <Text style={styles.formLabel}>HOW OFTEN</Text>
          <View style={styles.freqRow}>
            {(['once', 'daily', 'weekly'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.freqChip, frequency === f && styles.freqChipSelected]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.freqText, frequency === f && styles.freqTextSelected]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>WHAT TIME</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={styles.timeInput}
              value={hour}
              onChangeText={setHour}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.timeSep}>:</Text>
            <TextInput
              style={styles.timeInput}
              value={minute}
              onChangeText={setMinute}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, !topic.trim() && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!topic.trim()}
          >
            <Text style={styles.createButtonText}>Set check-in</Text>
          </TouchableOpacity>
        </View>
      )}

      {checkins.length === 0 && !showCreate ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No check-ins yet</Text>
          <Text style={styles.emptyHint}>
            "Want me to ask about your presentation tomorrow morning?"
          </Text>
        </View>
      ) : (
        <FlatList
          data={checkins}
          renderItem={renderCheckin}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  createForm: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.body,
    color: colors.text,
  },
  formLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: spacing.sm,
  },
  freqRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  freqChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  freqChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  freqText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  freqTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    width: 60,
    textAlign: 'center',
    ...typography.body,
    color: colors.text,
  },
  timeSep: {
    ...typography.h2,
    color: colors.textMuted,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTopic: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  triggeredText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptyHint: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
