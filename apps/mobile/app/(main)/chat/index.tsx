import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Thread } from '@alora/shared';

export default function ChatIndexScreen() {
  const { threads, loadThreads } = useChatStore();
  const { profile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadThreads();
  }, []);

  const defaultThread = threads.find((t) => t.is_default);

  // If there's a default thread, go straight to it
  useEffect(() => {
    if (defaultThread) {
      router.replace(`/(main)/chat/${defaultThread.id}`);
    }
  }, [defaultThread]);

  const renderThread = ({ item }: { item: Thread }) => (
    <TouchableOpacity
      style={styles.threadCard}
      onPress={() => router.push(`/(main)/chat/${item.id}`)}
    >
      <View style={[styles.threadDot, { backgroundColor: item.color }]} />
      <View style={styles.threadInfo}>
        <Text style={styles.threadTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.threadDesc} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <Text style={styles.threadCount}>{item.message_count}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {profile?.display_name ? `Hey, ${profile.display_name}` : 'Hey there'}
        </Text>
        <Text style={styles.subtitle}>Pick up where you left off</Text>
      </View>
      <FlatList
        data={threads}
        renderItem={renderThread}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  threadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  threadInfo: {
    flex: 1,
  },
  threadTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  threadDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  threadCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
