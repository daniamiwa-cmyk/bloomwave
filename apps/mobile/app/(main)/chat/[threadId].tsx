import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { usePersonaStore } from '@/stores/personaStore';
import { getPortrait } from '@/utils/portraitMap';
import { useTheme } from '@/theme/ThemeProvider';
import { colors as staticColors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { Message } from '@amai/shared';

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const {
    messages,
    isTyping,
    isLoadingHistory,
    gemsRemaining,
    setCurrentThread,
    sendMessage,
    threads,
  } = useChatStore();
  const { profile } = useAuthStore();
  const { personas, loadGallery } = usePersonaStore();
  const colors = useTheme();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const currentThread = threads.find((t) => t.id === threadId);
  const threadPersona = currentThread?.persona_id
    ? personas.find((p) => p.id === currentThread.persona_id)
    : null;
  const headerPortrait = threadPersona ? getPortrait(threadPersona.slug) : null;

  useEffect(() => {
    if (threadId) {
      setCurrentThread(threadId);
    }
    if (personas.length === 0) loadGallery();
  }, [threadId]);

  useEffect(() => {
    if (messages.length > 0) {
      const timeout = setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      return () => clearTimeout(timeout);
    }
  }, [messages.length, isTyping]);

  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);
    setError(null);
    try {
      await sendMessage(text);
    } catch (err: any) {
      if (err.message?.includes('INSUFFICIENT_GEMS')) {
        Alert.alert(
          'Out of gems',
          'You need more gems to continue chatting. Claim your daily gems or get more in the shop.',
          [{ text: 'OK' }],
        );
      } else {
        setError(err.message || 'Something went wrong. Tap to retry.');
      }
    } finally {
      setSending(false);
    }
  };

  const handleReportMessage = (message: Message) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Report this message', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
          title: 'Report Content',
          message: 'Flag this message as inappropriate or harmful.',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) submitReport(message);
        },
      );
    } else {
      Alert.alert(
        'Report Content',
        'Flag this message as inappropriate or harmful?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Report', style: 'destructive', onPress: () => submitReport(message) },
        ],
      );
    }
  };

  const submitReport = async (message: Message) => {
    try {
      await api.post('/api/v1/chat/report', {
        message_id: message.id,
        thread_id: threadId,
        content_preview: message.content.slice(0, 200),
      });
      Alert.alert('Report Submitted', 'Thank you. We will review this content.');
    } catch {
      Alert.alert('Report Submitted', 'Thank you. We will review this content.');
    }
  };

  const renderFormattedText = (text: string, baseStyle: object) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <Text key={i} style={[baseStyle, { fontStyle: 'italic' }]}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      return <Text key={i} style={baseStyle}>{part}</Text>;
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const textStyle = [
      styles.messageText,
      isUser ? { color: colors.userBubbleText } : { color: colors.aiBubbleText },
    ];
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={!isUser ? () => handleReportMessage(item) : undefined}
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.userBubble }]
              : [styles.aiBubble, { backgroundColor: colors.aiBubble, borderColor: colors.aiBubbleBorder }],
          ]}
        >
          <Text style={textStyle}>
            {renderFormattedText(item.content, StyleSheet.flatten(textStyle))}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    return (
      <View style={styles.messageRow}>
        <View style={[styles.bubble, styles.aiBubble, styles.typingBubble, { backgroundColor: colors.aiBubble, borderColor: colors.aiBubbleBorder }]}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1, { backgroundColor: colors.textMuted }]} />
            <View style={[styles.dot, styles.dot2, { backgroundColor: colors.textMuted }]} />
            <View style={[styles.dot, styles.dot3, { backgroundColor: colors.textMuted }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {headerPortrait ? (
            <Image source={headerPortrait} style={styles.headerPortrait} />
          ) : currentThread?.persona_emoji ? (
            <Text style={styles.headerEmoji}>{currentThread.persona_emoji}</Text>
          ) : null}
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {currentThread?.persona_name || (currentThread?.is_default ? 'Amaia' : currentThread?.title || 'Chat')}
          </Text>
        </View>
        <View style={styles.gemsDisplay}>
          <Text style={styles.gemsText}>{profile?.gems ?? gemsRemaining}</Text>
          <Ionicons name="diamond" size={14} color={staticColors.gem} />
        </View>
      </View>

      {/* Error banner */}
      {error && (
        <TouchableOpacity style={styles.errorBanner} onPress={() => setError(null)}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorDismiss}>Tap to dismiss</Text>
        </TouchableOpacity>
      )}

      {/* Loading history */}
      {isLoadingHistory && messages.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListFooterComponent={renderTypingIndicator}
          ListEmptyComponent={
            !isLoadingHistory ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>💜</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Start a conversation</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  Say hi, share what's on your mind, or ask me anything.
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            placeholder={`Message ${currentThread?.persona_name || 'Amaia'}...`}
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
              (!input.trim() || sending) && { backgroundColor: colors.border },
            ]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={input.trim() && !sending ? '#FFFFFF' : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  headerPortrait: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  headerEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    ...typography.h3,
  },
  gemsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFB80020',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  gemsText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#FFB800',
  },
  chatArea: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.body,
    lineHeight: 22,
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: 12,
    ...typography.body,
    maxHeight: 120,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  errorText: {
    ...typography.bodySmall,
    color: '#DC2626',
  },
  errorDismiss: {
    ...typography.caption,
    color: '#DC2626',
    opacity: 0.6,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
