import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
// Slider was removed from react-native core; use the community package.
import Slider from '@react-native-community/slider';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


type AccessibilitySettings = {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  fontScale: number;
  screenReader: boolean;
  hapticFeedback: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  autoPlayVideo: boolean;
  simplifyUI: boolean;
  voiceOver: boolean;
};

export default function AccessibilitySettingsScreen() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    fontScale: 1.0,
    screenReader: false,
    hapticFeedback: true,
    colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
    autoPlayVideo: true,
    simplifyUI: false,
    voiceOver: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(false);
  };

  // Keying to the real state shape means a typo in a setting name is a
  // compile error rather than a silently-ignored write.
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading accessibility...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Vision */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>VISION</Typography>
          
          <AccessibilityToggle 
            label="High Contrast" 
            description="Increase color contrast for better readability"
            icon="contrast"
            value={settings.highContrast}
            onChange={value => updateSetting('highContrast', value)}
          />
          
          <AccessibilityToggle 
            label="Large Text" 
            description="Increase text size across the app"
            icon="resize"
            value={settings.largeText}
            onChange={value => updateSetting('largeText', value)}
          />
          
          {settings.largeText && (
            <View style={styles.sliderContainer}>
              <Typography variant="caption" style={styles.sliderLabel}>FONT SCALE</Typography>
              <Slider
                style={styles.slider}
                minimumValue={1.0}
                maximumValue={2.0}
                step={0.1}
                value={settings.fontScale}
                onValueChange={(value: number) => updateSetting('fontScale', value)}
                minimumTrackTintColor={COLORS.vibrantPink}
                maximumTrackTintColor={COLORS.borderSubtle}
              />
              <Typography variant="caption" style={styles.sliderValue}>{settings.fontScale.toFixed(1)}x</Typography>
            </View>
          )}
          
          <AccessibilityToggle 
            label="Color Blind Mode" 
            description="Adjust colors for color vision deficiency"
            icon="eye"
            value={settings.colorBlindMode !== 'none'}
            onChange={value => updateSetting('colorBlindMode', value ? 'protanopia' : 'none')}
          />
          
          {settings.colorBlindMode !== 'none' && (
            <View style={styles.selectContainer}>
              <Typography variant="caption" style={styles.selectLabel}>TYPE</Typography>
              <View style={styles.selectButton}>
                <Typography variant="body" style={styles.selectValue}>
                  {settings.colorBlindMode.charAt(0).toUpperCase() + settings.colorBlindMode.slice(1)}
                </Typography>
                <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
              </View>
            </View>
          )}
        </GlassCard>

        {/* Motion */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>MOTION</Typography>
          
          <AccessibilityToggle 
            label="Reduce Motion" 
            description="Minimize animations and transitions"
            icon="pause-circle"
            value={settings.reducedMotion}
            onChange={value => updateSetting('reducedMotion', value)}
          />
          
          <AccessibilityToggle 
            label="Auto-play Videos" 
            description="Automatically play video content"
            icon="play-circle"
            value={settings.autoPlayVideo}
            onChange={value => updateSetting('autoPlayVideo', value)}
          />
        </GlassCard>

        {/* Interaction */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>INTERACTION</Typography>
          
          <AccessibilityToggle 
            label="Haptic Feedback" 
            description="Vibration feedback for actions"
            icon="phone-portrait"
            value={settings.hapticFeedback}
            onChange={value => updateSetting('hapticFeedback', value)}
          />
          
          <AccessibilityToggle 
            label="Screen Reader Support" 
            description="Optimize for VoiceOver/TalkBack"
            icon="mic"
            value={settings.screenReader}
            onChange={value => updateSetting('screenReader', value)}
          />
          
          <AccessibilityToggle 
            label="Simplify UI" 
            description="Reduce visual complexity"
            icon="remove-circle"
            value={settings.simplifyUI}
            onChange={value => updateSetting('simplifyUI', value)}
          />
        </GlassCard>

        {/* Voice */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>VOICE</Typography>
          
          <AccessibilityToggle 
            label="Voice Commands" 
            description="Control app with voice (beta)"
            icon="mic-circle"
            value={settings.voiceOver}
            onChange={value => updateSetting('voiceOver', value)}
          />
        </GlassCard>

        {/* Reset */}
        <SquishyButton 
          variant="ghost"
          onPress={() => { /* Reset to defaults */ }}
          style={styles.resetButton}
        >
          <Ionicons name="refresh" size={18} color={COLORS.textSecondary} style={{ marginRight: SPACING.small }} />
          <Typography variant="button" color={COLORS.textSecondary}>RESET TO DEFAULTS</Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
}

type AccessibilityToggleProps = {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: boolean;
  onChange: (value: boolean) => void;
};

const AccessibilityToggle = ({ label, description, icon, value, onChange }: AccessibilityToggleProps) => (
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
  sliderContainer: {
    marginTop: SPACING.regular,
    paddingTop: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  sliderLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.regular,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    textAlign: 'right',
    color: COLORS.vibrantPink,
    fontWeight: '600',
    marginTop: SPACING.small,
  },
  selectContainer: {
    marginTop: SPACING.regular,
    paddingTop: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  selectLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  selectValue: {
    color: COLORS.textPrimary,
  },
  resetButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});