import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getPortrait } from '@/utils/portraitMap';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, radius } from '@/theme/spacing';
import type { PersonaCard } from '@amai/shared';

interface Props {
  persona: PersonaCard | null;
  visible: boolean;
  onClose: () => void;
  onUnlock: (personaId: string) => Promise<void>;
}

export function UnlockModal({ persona, visible, onClose, onUnlock }: Props) {
  const [unlocking, setUnlocking] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!persona) return null;

  const portrait = getPortrait(persona.slug);
  const req = persona.unlock_requirement;
  const isGems = req.method === 'gems';

  const getRequirementText = () => {
    switch (req.method) {
      case 'starter':
        return 'Free at signup';
      case 'messages':
        return `Send ${req.value} messages`;
      case 'streak':
        return `${req.value}-day streak`;
      case 'threads':
        return `Create ${req.value} threads`;
      case 'gems':
        return `${req.value} gems`;
      default:
        return 'Unknown';
    }
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await onUnlock(persona.id);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      Alert.alert('Unlock failed', err.message || 'Could not unlock persona');
      setUnlocking(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {success ? (
            <View style={styles.successContent}>
              {portrait ? (
                <Image source={portrait} style={styles.successPortrait} />
              ) : (
                <Text style={styles.successEmoji}>{persona.avatar_emoji}</Text>
              )}
              <Text style={styles.successTitle}>Unlocked!</Text>
              <Text style={styles.successSubtitle}>
                {persona.name} is ready to chat
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>

              {portrait ? (
                <Image source={portrait} style={styles.portrait} />
              ) : (
                <Text style={styles.emoji}>{persona.avatar_emoji}</Text>
              )}
              <Text style={styles.name}>{persona.name}</Text>
              <Text style={styles.tagline}>{persona.tagline}</Text>

              <View style={styles.reqContainer}>
                <Ionicons
                  name={isGems ? 'diamond' : 'trophy'}
                  size={16}
                  color={isGems ? colors.gem : colors.primary}
                />
                <Text style={styles.reqText}>{getRequirementText()}</Text>
              </View>

              <TouchableOpacity
                style={[styles.unlockButton, { backgroundColor: persona.color || colors.primary }]}
                onPress={handleUnlock}
                disabled={unlocking}
              >
                {unlocking ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.unlockButtonText}>
                    {isGems ? `Spend ${req.value} gems` : 'Unlock'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  portrait: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  reqContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  reqText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  unlockButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  unlockButtonText: {
    ...typography.button,
    color: '#FFF',
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successPortrait: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
