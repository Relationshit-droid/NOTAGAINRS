import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY, GradientColors } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function NotificationSettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [settings, setSettings] = useState({
    pushEnabled: true,
    gameReminders: true,
    partnerActivity: true,
    weeklyReport: true,
    streakReminders: true,
    sosAlerts: true,
    achievementUnlocks: true,
    dailyPrompt: false,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    // In real app, fetch from backend
    setLoading(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In real app, save to backend
  };

  useEffect(() => {
    fetchSettings();
  }, [user, userId]);

  const notificationCategories = [
    {
      title: 'GAME ACTIVITY',
      items: [
        { key: 'gameReminders', label: 'Game Reminders', description: 'Reminders to play scheduled games', icon: 'game-controller' },
        { key: 'partnerActivity', label: 'Partner Activity', description: 'When your partner completes a game', icon: 'person' },
        { key: 'dailyPrompt', label: 'Daily Prompts', description: 'Daily relationship check-in prompts', icon: 'sunny' },
      ],
    },
    {
      title: 'PROGRESS & INSIGHTS',
      items: [
        { key: 'weeklyReport', label: 'Weekly Report', description: 'Your weekly relationship summary', icon: 'document-text' },
        { key: 'streakReminders', label: 'Streak Reminders', description: 'Don\'t break your streak!', icon: 'flame' },
        { key: 'achievementUnlocks', label: 'Achievement Unlocks', description: 'Celebrate your milestones', icon: 'trophy' },
      ],
    },
    {
      title: 'EMERGENCY',
      items: [
        { key: 'sosAlerts', label: 'SOS Alerts', description: 'Emergency fight resolution requests', icon: 'alert-circle' },
      ],
    },
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading notifications...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Master Toggle */}
        <GlassCard style={styles.masterCard} variant="elevated">
          <View style={styles.masterToggle}>
            <View style={styles.masterInfo}>
              <LinearGradient colors={GRADIENTS.primary.colors} style={styles.masterIcon}>
                <Ionicons name="notifications" size={24} color={COLORS.textPrimary} />
              </LinearGradient>
              <View>
                <Typography variant="label" style={styles.masterTitle}>PUSH NOTIFICATIONS</Typography>
                <Typography variant="caption" style={styles.masterSubtitle}>Master switch for all notifications</Typography>
              </View>
            </View>
            <Switch
              value={settings.pushEnabled}
              onValueChange={value => updateSetting('pushEnabled', value)}
              thumbColor={settings.pushEnabled ? COLORS.vibrantPink : COLORS.textHint}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.vibrantPink + '40' }}
            />
          </View>
        </GlassCard>

        {/* Notification Categories */}
        {notificationCategories.map((category, catIndex) => (
          <GlassCard key={category.title} style={styles.sectionCard}>
            <Typography variant="label" style={styles.sectionTitle}>{category.title}</Typography>
            
            {category.items.map((item, itemIndex) => (
              <View key={item.key} style={[
                styles.notificationItem,
                itemIndex === category.items.length - 1 ? styles.notificationItemLast : {},
              ]}>
                <View style={styles.itemLeft}>
                  <LinearGradient colors={getCategoryGradient(item.key)} style={styles.itemIcon}>
                    <Ionicons name={item.icon} size={20} color={COLORS.textPrimary} />
                  </LinearGradient>
                  <View style={styles.itemText}>
                    <Typography variant="label" style={styles.itemLabel}>{item.label}</Typography>
                    <Typography variant="caption" style={styles.itemDescription}>{item.description}</Typography>
                  </View>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={value => updateSetting(item.key, value)}
                  disabled={!settings.pushEnabled}
                  thumbColor={settings[item.key] ? COLORS.vibrantPink : COLORS.textHint}
                  trackColor={{ false: COLORS.borderSubtle, true: COLORS.vibrantPink + '40' }}
                />
              </View>
            ))}
          </GlassCard>
        ))}

        {/* Sound & Vibration */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>SOUND & VIBRATION</Typography>
          
          <View style={styles.notificationItem}>
            <View style={styles.itemLeft}>
              <LinearGradient colors={GRADIENTS.primary.colors} style={styles.itemIcon}>
                <Ionicons name="volume-high" size={20} color={COLORS.textPrimary} />
              </LinearGradient>
              <View style={styles.itemText}>
                <Typography variant="label" style={styles.itemLabel}>Notification Sounds</Typography>
                <Typography variant="caption" style={styles.itemDescription}>Play sound for notifications</Typography>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={value => updateSetting('soundEnabled', value)}
              disabled={!settings.pushEnabled}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.itemLeft}>
              <LinearGradient colors={GRADIENTS.primary.colors} style={styles.itemIcon}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.textPrimary} />
              </LinearGradient>
              <View style={styles.itemText}>
                <Typography variant="label" style={styles.itemLabel}>Vibration</Typography>
                <Typography variant="caption" style={styles.itemDescription}>Vibrate for notifications</Typography>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={value => updateSetting('vibrationEnabled', value)}
              disabled={!settings.pushEnabled}
            />
          </View>
        </GlassCard>

        {/* Quiet Hours */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>QUIET HOURS</Typography>
          
          <View style={styles.notificationItem}>
            <View style={styles.itemLeft}>
              <LinearGradient colors={GRADIENTS.primary.colors} style={styles.itemIcon}>
                <Ionicons name="moon" size={20} color={COLORS.textPrimary} />
              </LinearGradient>
              <View style={styles.itemText}>
                <Typography variant="label" style={styles.itemLabel}>Enable Quiet Hours</Typography>
                <Typography variant="caption" style={styles.itemDescription}>Suppress notifications during sleep</Typography>
              </View>
            </View>
            <Switch
              value={settings.quietHoursEnabled}
              onValueChange={value => updateSetting('quietHoursEnabled', value)}
              disabled={!settings.pushEnabled}
            />
          </View>

          {settings.quietHoursEnabled && (
            <>
              <View style={styles.timePickers}>
                <View style={styles.timePicker}>
                  <Typography variant="caption" style={styles.timeLabel}>START</Typography>
                  <TouchableOpacity style={styles.timeButton}>
                    <Typography variant="body" style={styles.timeValue}>{settings.quietHoursStart}</Typography>
                    <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
                  </TouchableOpacity>
                </View>
                <View style={styles.timePicker}>
                  <Typography variant="caption" style={styles.timeLabel}>END</Typography>
                  <TouchableOpacity style={styles.timeButton}>
                    <Typography variant="body" style={styles.timeValue}>{settings.quietHoursEnd}</Typography>
                    <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </GlassCard>

        {/* Test Notification */}
        <SquishyButton 
          variant="secondary"
          onPress={() => {}}
          style={styles.testButton}
        >
          <Ionicons name="send" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
          <Typography variant="button">SEND TEST NOTIFICATION</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

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
  masterCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  masterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  masterIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterTitle: {
    marginBottom: SPACING.tiny,
  },
  masterSubtitle: {
    color: COLORS.textHint,
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
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  notificationItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    marginBottom: SPACING.tiny,
  },
  itemDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  timePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.regular,
    paddingTop: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  timePicker: {
    flex: 1,
  },
  timeLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.tiny,
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
  testButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});

function getCategoryGradient(key: string): GradientColors {
  const gradients: Record<string, string[]> = {
    gameReminders: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
    partnerActivity: [COLORS.aquaTeal, COLORS.aquaTeal + '80'],
    dailyPrompt: [COLORS.warmOrange, COLORS.warmOrange + '80'],
    weeklyReport: [COLORS.brightYellow, COLORS.brightYellow + '80'],
    streakReminders: [COLORS.warmOrange, COLORS.warmOrange + '80'],
    achievementUnlocks: [COLORS.brightYellow, COLORS.brightYellow + '80'],
    sosAlerts: [COLORS.error, COLORS.error + '80'],
    default: [COLORS.vibrantPink, COLORS.vibrantPink + '80'],
  };
  return gradients[key] || gradients.default;
}