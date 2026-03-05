import { useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { usePersonaStore } from '@/stores/personaStore';
import { getPortrait } from '@/utils/portraitMap';
import { useTheme } from '@/theme/ThemeProvider';
import { colors as staticColors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Thread } from '@amai/shared';

export default function ChatIndexScreen() {
  const { threads, loadThreads, deleteThread } = useChatStore();
  const { profile } = useAuthStore();
  const { personas, loadGallery } = usePersonaStore();
  const colors = useTheme();
  const router = useRouter();

  useEffect(() => {
    loadThreads();
    if (personas.length === 0) loadGallery();
  }, []);

  const defaultThread = threads.find((t) => t.is_default);

  // If there's a default thread, go straight to it
  useEffect(() => {
    if (defaultThread) {
      router.replace(`/(main)/chat/${defaultThread.id}`);
    }
  }, [defaultThread]);

  const handleDeleteThread = (thread: Thread) => {
    Alert.alert(
      'Delete conversation',
      `Delete "${thread.title}"? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThread(thread.id);
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    thread: Thread,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteThread(thread)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderThread = ({ item }: { item: Thread }) => {
    const persona = item.persona_id
      ? personas.find((p) => p.id === item.persona_id)
      : null;
    const portrait = persona ? getPortrait(persona.slug) : null;

    return (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      overshootRight={false}
    >
      <TouchableOpacity
        style={[styles.threadCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push(`/(main)/chat/${item.id}`)}
      >
        {portrait ? (
          <Image source={portrait} style={styles.threadPortrait} />
        ) : (
          <View style={[styles.threadDot, { backgroundColor: item.color }]} />
        )}
        <View style={styles.threadInfo}>
          <Text style={[styles.threadTitle, { color: colors.text }]}>{item.title}</Text>
          {item.description && (
            <Text style={[styles.threadDesc, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        <Text style={[styles.threadCount, { color: colors.textMuted }]}>{item.message_count}</Text>
      </TouchableOpacity>
    </Swipeable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          {profile?.display_name ? `Hey, ${profile.display_name}` : 'Hey there'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Pick up where you left off</Text>
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
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: { ...typography.h2 },
  subtitle: { ...typography.bodySmall, marginTop: 2 },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  threadPortrait: { width: 36, height: 36, borderRadius: 18, marginRight: spacing.md },
  threadDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  threadInfo: { flex: 1 },
  threadTitle: { ...typography.body, fontWeight: '600' },
  threadDesc: { ...typography.caption, marginTop: 2 },
  threadCount: { ...typography.caption },
  deleteAction: {
    backgroundColor: staticColors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: radius.md,
    marginLeft: spacing.xs,
  },
  deleteActionText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
});
