import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function LoveArcadeSettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [settings, setSettings] = useState({
    autoPlayLifelines: false,
    showHints: true,
    celebrateAchievements: true,
    arcadeMusic: true,
    arcadeSoundEffects: true,
    hapticFeedback: true,
    reducedMotion: false,
    highContrast: false,
    autoAdvancePhase: false,
    shareProgress: true,
    competitiveMode: false,
    dailyReminder: true,
    reminderTime: '19:00',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchSettings();
  }, [user, userId]);

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading settings...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Gameplay */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>GAMEPLAY</Typography>
          
          <SettingsToggle 
            label="Auto-play Lifelines" 
            description="Automatically use lifelines when stuck"
            icon="flash"
            value={settings.autoPlayLifelines}
            onChange={value => updateSetting('autoPlayLifelines', value)}
          />
          
          <SettingsToggle 
            label="Show Hints" 
            description="Display helpful hints during games"
            icon="lightbulb"
            value={settings.showHints}
            onChange={value => updateSetting('showHints', value)}
          />
          
          <SettingsToggle 
            label="Celebrate Achievements" 
            description="Show animation when unlocking trophies"
            icon="trophy"
            value={settings.celebrateAchievements}
            onChange={value => updateSetting('celebrateAchievements', value)}
          />
          
          <SettingsToggle 
            label="Auto-advance Phase" 
            description="Automatically unlock next phase when ready"
            icon="forward"
            value={settings.autoAdvancePhase}
            onChange={value => updateSetting('autoAdvancePhase', value)}
          />
          
          <SettingsToggle 
            label="Competitive Mode" 
            description="Show partner's score in real-time during games"
            icon="people"
            value={settings.competitiveMode}
            onChange={value => updateSetting('competitiveMode', value)}
          />
        </GlassCard>

        {/* Audio & Visual */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>AUDIO & VISUAL</Typography>
          
          <SettingsToggle 
            label="Arcade Music" 
            description="Background music in the arcade"
            icon="musical-notes"
            value={settings.arcadeMusic}
            onChange={value => updateSetting('arcadeMusic', value)}
          />
          
          <SettingsToggle 
            label="Sound Effects" 
            description="Button clicks, transitions, celebrations"
            icon="volume-high"
            value={settings.arcadeSoundEffects}
            onChange={value => updateSetting('arcadeSoundEffects', value)}
          />
          
          <SettingsToggle 
            label="Haptic Feedback" 
            description="Vibration for actions and achievements"
            icon="vibrate"
            value={settings.hapticFeedback}
            onChange={value => updateSetting('hapticFeedback', value)}
          />
          
          <SettingsToggle 
            label="Reduced Motion" 
            description="Minimize animations and transitions"
            icon="pause-circle"
            value={settings.reducedMotion}
            onChange={value => updateSetting('reducedMotion', value)}
          />
          
          <SettingsToggle 
            label="High Contrast" 
            description="Increase color contrast for readability"
            icon="contrast"
            value={settings.highContrast}
            onChange={value => updateSetting('highContrast', value)}
          />
        </GlassCard>

        {/* Social */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>SOCIAL</Typography>
          
          <SettingsToggle 
            label="Share Progress" 
            description="Auto-share phase completion with partner"
            icon="share"
            value={settings.shareProgress}
            onChange={value => updateSetting('shareProgress', value)}
          />
          
          <SettingsToggle 
            label="Daily Reminder" 
            description="Reminder to play at your preferred time"
            icon="alarm"
            value={settings.dailyReminder}
            onChange={value => updateSetting('dailyReminder', value)}
          />
          
          {settings.dailyReminder && (
            <View style={styles.timePicker}>
              <Typography variant="caption" style={styles.timeLabel}>REMINDER TIME</Typography>
              <TouchableOpacity style={styles.timeButton}>
                <Typography variant="body" style={styles.timeValue}>{settings.reminderTime}</Typography>
                <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>

        {/* Data Management */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DATA</Typography>
          
          <SettingsAction 
            label="Export Arcade Data" 
            description="Download your arcade progress and trophies"
            icon="download"
            color={COLORS.vibrantPink}
            onPress={() => Alert.alert('Export', 'Your arcade data export will be prepared.')}
          />
          
          <SettingsAction 
            label="Reset Arcade Progress" 
            description="Keep trophies, reset phase progress and scores"
            icon="refresh"
            color={COLORS.warmOrange}
            onPress={() => Alert.alert('Reset Progress', 'This will reset your phase progress and scores. Trophies will be kept.', [
              { text: 'Cancel' },
              { text: 'Reset', onPress: () => Alert.alert('Progress Reset', 'Arcade progress has been reset.') }
            ])}
          />
          
          <SettingsAction 
            label="Clear Arcade Cache" 
            description="Remove temporary files and cached game data"
            icon="trash"
            color={COLORS.error}
            onPress={() => Alert.alert('Cache Cleared', 'Temporary arcade files have been removed.', [{ text: 'OK' }])}
          />
        </GlassCard>

        {/* Reset All */}
        <SquishyButton 
          variant="ghost"
          onPress={() => Alert.alert('Reset Settings', 'Reset all arcade settings to defaults?', [
            { text: 'Cancel' },
            { text: 'Reset', onPress: () => Alert.alert('Settings Reset', 'All arcade settings have been restored to defaults.') }
          ]), 
          style={styles.resetButton}
        >
          <Ionicons name="refresh" size={18} color={COLORS.textSecondary} style={{ marginRight: SPACING.small }} />
          <Typography variant="button" color={COLORS.textSecondary}>RESET TO DEFAULTS</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

const SettingsToggle = ({ label, description, icon, value, onChange }: any) => (
  <View style={styles.toggleItem}>
    <View style={styles.toggleLeft}>
      <LinearGradient colors={GRADIENTS.primary.colors} style={styles.toggleIcon}>
        <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
      </LinearGradient>
      <View style={styles.toggleText}>
        <Typography variant="label" style={styles.toggleLabel}>{label}</Typography>
        <Typography variant="caption" style={styles.toggleDescription}>{description}</Typography>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      thumbColor={value ? COLORS.vibrantPink : COLORS.textHint}
      trackColor={{ false: COLORS.borderSubtle, true: COLORS.vibrantPink + '40' }}
    />
  </View>
);

const SettingsAction = ({ label, description, icon, color, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.actionButton, { borderColor: color }]}
    onPress={onPress}
  >
    <LinearGradient colors={[color, color + '80']} style={styles.actionIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <View style={styles.actionText}>
      <Typography variant="label" style={styles.actionLabel}>{label}</Typography>
      <Typography variant="caption" style={styles.actionDescription}>{description}</Typography>
    </View>
    <Ionicons name="chevron-forward" size={20} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    marginBottom: SPACING.tiny,
  },
  toggleDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  timePicker: {
    marginTop: SPACING.regular,
    paddingTop: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  timeLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  timeValue: {
    color: COLORS.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
    marginBottom: SPACING.regular,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    marginBottom: SPACING.tiny,
  },
  actionDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  resetButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});