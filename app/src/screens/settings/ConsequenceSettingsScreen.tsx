import React, { useState, useEffect } from 'react';
import type { IoniconName } from '../../types/icons';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';
import { useConsequenceEngine } from '../../lib/consequence-engine';

export default function ConsequenceSettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const { penalties, loading: penaltiesLoading, loadPenalties, addPenalty, removePenalty, checkRomanceLocked } = useConsequenceEngine();
  
  const [settings, setSettings] = useState({
    enabled: true,
    romanceLockout: true,
    notificationSpam: true,
    hubLockout: true,
    publicShame: false,
    wallpaperSwap: false,
    skipPenaltyHours: 1,
    inactivityHours: 24,
    inactivityNotifications: 5,
    betaMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [romanceLocked, setRomanceLocked] = useState(false);

  const fetchSettings = async () => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      // In real app, fetch from backend
      const locked = await checkRomanceLocked();
      setRomanceLocked(locked);
      await loadPenalties();
    } catch (error) {
      console.error('Failed to fetch consequence settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In real app, save to backend
  };

  const testPenalty = async (type: string) => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      // In real app, call backend
      await addPenalty(type as any, 1);
      Alert.alert('Test Penalty Applied', `${type} penalty applied for 1 hour`);
    } catch (error) {
      console.error('Failed to apply test penalty:', error);
    }
  };

  const clearAllPenalties = async () => {
    if (!user || !userId) return;
    Alert.alert(
      'Clear All Penalties',
      'This will remove all active penalties. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: async () => {
          // Clear all penalties
          for (const p of penalties) {
            await removePenalty(p.type);
          }
        }, style: 'destructive' }
      ]
    );
  };

  useEffect(() => {
    fetchSettings();
  }, [user, userId]);

  const consequenceTypes = [
    {
      key: 'romanceLockout',
      label: 'Romance Lockout',
      description: 'Blocks romance games until repair completed',
      icon: 'lock-closed' as IoniconName,
      color: COLORS.error,
      severity: 'HIGH',
      default: true,
    },
    {
      key: 'notificationSpam',
      label: 'Notification Spam',
      description: 'Hourly "Do Better" reminders',
      icon: 'notifications' as IoniconName,
      color: COLORS.warmOrange,
      severity: 'MEDIUM',
      default: true,
    },
    {
      key: 'hubLockout',
      label: 'Romance Hub Lockout',
      description: 'Denies access to Romance Hub until tasks done',
      icon: 'heart-broken' as IoniconName,
      color: COLORS.vibrantPink,
      severity: 'HIGH',
      default: true,
    },
    {
      key: 'publicShame',
      label: 'Public Shame',
      description: '"Timeout" hat on leaderboard avatar',
      icon: 'person-circle' as IoniconName,
      color: COLORS.lavenderPurple,
      severity: 'LOW',
      default: false,
    },
    {
      key: 'wallpaperSwap',
      label: 'Wallpaper Swap',
      description: 'Partner\'s disappointed face as wallpaper',
      icon: 'image' as IoniconName,
      color: COLORS.warmOrange,
      severity: 'LOW',
      default: false,
    },
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading consequences...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Master Toggle */}
        <GlassCard style={[styles.masterCard, settings.enabled && styles.masterCardActive]} variant="elevated">
          <View style={styles.masterToggle}>
            <View style={styles.masterInfo}>
              <LinearGradient colors={settings.enabled ? GRADIENTS.primary.colors : [COLORS.textHint, COLORS.textHint]} style={styles.masterIcon}>
                <Ionicons name={settings.enabled ? 'shield-checkmark' : 'shield-half'} size={24} color={COLORS.textPrimary} />
              </LinearGradient>
              <View>
                <Typography variant="label" style={styles.masterTitle}>CONSEQUENCE ENGINE</Typography>
                <Typography variant="caption" style={styles.masterSubtitle}>
                  {settings.enabled ? 'Active - Dr. Marcie is watching' : 'Disabled - No consequences applied'}
                </Typography>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={value => updateSetting('enabled', value)}
              thumbColor={settings.enabled ? COLORS.vibrantPink : COLORS.textHint}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.vibrantPink + '40' }}
            />
          </View>
          
          {romanceLocked && (
            <View style={styles.lockedBanner}>
              <Ionicons name="alert-circle" size={16} color={COLORS.error} />
              <Typography variant="caption" color={COLORS.error}>
                🔒 ROMANCE LOCKED - Complete a repair session to unlock
              </Typography>
            </View>
          )}
        </GlassCard>

        {/* Beta Mode */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.betaToggle}>
            <View style={styles.masterInfo}>
              <LinearGradient colors={[COLORS.brightYellow, COLORS.warmOrange]} style={styles.masterIcon}>
                <Ionicons name={settings.betaMode ? 'checkbox' : 'checkbox-outline'} size={24} color={COLORS.textPrimary} />
              </LinearGradient>
              <View>
                <Typography variant="label" style={styles.masterTitle}>BETA MODE (No Consequences)</Typography>
                <Typography variant="caption" style={styles.masterSubtitle}>
                  Disable all consequences for testing. Not recommended for real relationships.
                </Typography>
              </View>
            </View>
            <Switch
              value={settings.betaMode}
              onValueChange={value => updateSetting('betaMode', value)}
              thumbColor={settings.betaMode ? COLORS.brightYellow : COLORS.textHint}
              trackColor={{ false: COLORS.borderSubtle, true: COLORS.brightYellow + '40' }}
            />
          </View>
        </GlassCard>

        {/* Consequence Types */}
        {consequenceTypes.map((consequence, index) => (
          <GlassCard key={consequence.key} style={styles.sectionCard}>
            <View style={styles.consequenceHeader}>
              <LinearGradient colors={[consequence.color, consequence.color + '80']} style={styles.consequenceIcon}>
                <Ionicons name={consequence.icon} size={24} color={COLORS.textPrimary} />
              </LinearGradient>
              <View style={styles.consequenceInfo}>
                <View style={styles.consequenceTitleRow}>
                  <Typography variant="label" style={styles.consequenceLabel}>{consequence.label}</Typography>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: consequence.color + '20' },
                  ]}>
                    <Typography variant="caption" style={{ color: consequence.color }}>{consequence.severity}</Typography>
                  </View>
                </View>
                <Typography variant="caption" style={styles.consequenceDescription}>{consequence.description}</Typography>
              </View>
            </View>
            
            <View style={styles.consequenceControls}>
              <Switch
                value={settings[consequence.key] && settings.enabled}
                onValueChange={value => {
                  if (settings.enabled) {
                    updateSetting(consequence.key, value);
                  }
                }}
                disabled={!settings.enabled || settings.betaMode}
                thumbColor={settings[consequence.key] ? consequence.color : COLORS.textHint}
                trackColor={{ false: COLORS.borderSubtle, true: consequence.color + '40' }}
              />
              {!settings.betaMode && (
                <TouchableOpacity 
                  onPress={() => testPenalty(consequence.key)}
                  disabled={!settings.enabled}
                  style={styles.testButton}
                >
                  <Typography variant="caption" style={{ color: settings.enabled ? consequence.color : COLORS.textHint }}>
                    TEST (1hr)
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        ))}

        {/* Timing Settings */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>TIMING CONFIGURATION</Typography>
          
          <View style={styles.timingGrid}>
            <TimingInput 
              label="Inactivity Trigger" 
              description="Hours before consequences activate"
              value={settings.inactivityHours}
              unit="hrs"
              min={1}
              max={168}
              onChange={value => updateSetting('inactivityHours', value)}
            />
            <TimingInput 
              label="Inactivity Notifications" 
              description="Number of reminders sent"
              value={settings.inactivityNotifications}
              unit="alerts"
              min={1}
              max={20}
              onChange={value => updateSetting('inactivityNotifications', value)}
            />
            <TimingInput 
              label="Skip Penalty Duration" 
              description="Hours locked after skipping"
              value={settings.skipPenaltyHours}
              unit="hrs"
              min={1}
              max={24}
              onChange={value => updateSetting('skipPenaltyHours', value)}
            />
          </View>
        </GlassCard>

        {/* Active Penalties */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Typography variant="label" style={styles.sectionTitle}>ACTIVE PENALTIES</Typography>
            {penalties.length > 0 && (
              <TouchableOpacity onPress={clearAllPenalties} style={styles.clearAllButton}>
                <Typography variant="caption" color={COLORS.error}>CLEAR ALL</Typography>
              </TouchableOpacity>
            )}
          </View>
          
          {penalties.length === 0 ? (
            <View style={styles.emptyPenalties}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.mintGreen} />
              <Typography variant="label" style={styles.emptyTitle}>NO ACTIVE PENALTIES</Typography>
              <Typography variant="caption" style={styles.emptySubtitle}>Keep it that way, darling.</Typography>
            </View>
          ) : (
            <View style={styles.penaltiesList}>
              {penalties.map((penalty: any, index: number) => (
                <View key={index} style={styles.penaltyItem}>
                  <View style={styles.penaltyInfo}>
                    <View style={[styles.penaltyIcon, { backgroundColor: penalty.color + '20' }]}>
                      <Ionicons name={penalty.icon} size={20} color={penalty.color} />
                    </View>
                    <View>
                      <Typography variant="label" style={styles.penaltyLabel}>{penalty.label}</Typography>
                      <Typography variant="caption" style={styles.penaltyExpires}>
                        Expires in {formatTimeRemaining(penalty.expiresAt)}
                      </Typography>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removePenalty(penalty.type)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        {/* Warning */}
        <GlassCard style={[styles.sectionCard, styles.warningCard]}>
          <View style={styles.warningContent}>
            <Ionicons name="warning" size={32} color={COLORS.error} />
            <View>
              <Typography variant="label" color={COLORS.error} style={styles.warningTitle}>REMEMBER</Typography>
              <Typography variant="body" style={styles.warningText}>
                Consequences aren't punishment — they're accountability. Dr. Marcie uses them to help you both stay committed to growth. Disable at your own risk.
              </Typography>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

type TimingInputProps = {
  label: string;
  description: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const TimingInput = ({ label, description, value, unit, min, max, onChange }: TimingInputProps) => (
  <View style={styles.timingInput}>
    <View>
      <Typography variant="label" style={styles.timingLabel}>{label}</Typography>
      <Typography variant="caption" style={styles.timingDescription}>{description}</Typography>
    </View>
    <View style={styles.timingValueContainer}>
      <TouchableOpacity onPress={() => onChange(Math.max(min, value - 1))} style={styles.timingButton}>
        <Ionicons name="remove" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Typography variant="header" style={styles.timingValue}>{value} {unit}</Typography>
      <TouchableOpacity onPress={() => onChange(Math.min(max, value + 1))} style={styles.timingButton}>
        <Ionicons name="add" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
  },
  clearAllButton: {
    alignSelf: 'flex-end',
  },
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
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  masterCardActive: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '08',
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
    fontSize: 12,
  },
  lockedBanner: {
    marginTop: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.error + '15',
    borderRadius: BORDER_RADIUS.large,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  betaToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consequenceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  consequenceIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  consequenceInfo: {
    flex: 1,
  },
  consequenceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  consequenceLabel: {
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  consequenceDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  consequenceControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testButton: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
  },
  timingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  timingInput: {
    flex: 1,
    minWidth: '30%',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  timingLabel: {
    marginBottom: SPACING.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timingDescription: {
    color: COLORS.textHint,
    fontSize: 11,
    marginBottom: SPACING.regular,
  },
  timingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  timingButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyPenalties: {
    alignItems: 'center',
    padding: SPACING.xxxlarge,
  },
  emptyTitle: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
    color: COLORS.mintGreen,
  },
  emptySubtitle: {
    color: COLORS.textHint,
    fontStyle: 'italic',
  },
  penaltiesList: {
    gap: SPACING.regular,
  },
  penaltyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  penaltyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  penaltyIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  penaltyLabel: {
    marginBottom: SPACING.tiny,
  },
  penaltyExpires: {
    color: COLORS.textHint,
    fontSize: 11,
  },
  removeButton: {
    padding: SPACING.small,
  },
  warningCard: {
    borderWidth: 2,
    borderColor: COLORS.error + '40',
    backgroundColor: COLORS.error + '08',
  },
  warningContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
  },
  warningTitle: {
    marginBottom: SPACING.small,
  },
  warningText: {
    lineHeight: 22,
  },
});

function formatTimeRemaining(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}