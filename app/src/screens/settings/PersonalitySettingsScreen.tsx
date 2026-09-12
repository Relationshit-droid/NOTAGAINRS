import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// Slider was removed from react-native core; use the community package.
import Slider from '@react-native-community/slider';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function PersonalitySettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [settings, setSettings] = useState({
    sarcasmLevel: 2, // 1-4
    marciePersonality: 'balanced', // 'warm', 'balanced', 'clinical', 'oracle'
    notificationStyle: 'playful', // 'playful', 'direct', 'supportive'
    gameIntensity: 'moderate', // 'gentle', 'moderate', 'intense'
    humorLevel: 2, // 1-3
    vulnerabilityComfort: 2, // 1-3
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      // In real app, fetch from backend
      setSettings(prev => ({ ...prev, sarcasmLevel: 2, marciePersonality: 'balanced' }));
    } catch (error) {
      console.error('Failed to fetch personality:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'sarcasmLevel' && user && userId) {
      const token = user.getIdToken().then(t => {
        // Save to backend
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user, userId]);

  const sarcasmLevels = [
    { level: 1, name: 'Tough Love Rookie', description: 'Mild sarcasm, warm but blunt. Good for beginners.', emoji: '🌱' },
    { level: 2, name: 'Reality Check Specialist', description: 'Clinical, analytical sarcasm. Cuts through noise.', emoji: '🔍' },
    { level: 3, name: 'Radical Truth Wizard', description: 'Deep, powerful, poetic truth. Not for the faint of heart.', emoji: '🧙‍♀️' },
    { level: 4, name: 'The Glamour Oracle', description: 'Full Noir Prophecy Mode. Maximum intensity.', emoji: '👁️' },
  ];

  const personalities = [
    { id: 'warm', name: 'Warm & Nurturing', description: 'Supportive, gentle guidance with a touch of wisdom', emoji: '🤗' },
    { id: 'balanced', name: 'Balanced & Direct', description: 'Equal parts empathy and accountability', emoji: '⚖️' },
    { id: 'clinical', name: 'Clinical & Analytical', description: 'Objective, pattern-focused, evidence-based', emoji: '🔬' },
    { id: 'oracle', name: 'Mystical Oracle', description: 'Metaphorical, poetic, sees the deeper patterns', emoji: '🔮' },
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading personality...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sarcasm Level */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={GRADIENTS.primary.colors} style={styles.sectionIcon}>
              <Ionicons name="chatbubbles" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.sectionTitle}>SARCASM LEVEL</Typography>
              <Typography variant="caption" style={styles.sectionSubtitle}>How sharp should Dr. Marcie's wit be?</Typography>
            </View>
          </View>

          <View style={styles.levelSelector}>
            {sarcasmLevels.map(level => (
              <SarcasmLevelCard 
                key={level.level}
                level={level}
                selected={settings.sarcasmLevel === level.level}
                onPress={() => updateSetting('sarcasmLevel', level.level)}
              />
            ))}
          </View>

          <View style={styles.currentLevel}>
            <Typography variant="caption" style={styles.currentLabel}>CURRENT: LEVEL {settings.sarcasmLevel}</Typography>
            <Typography variant="body" style={styles.currentDescription}>
              {sarcasmLevels.find(l => l.level === settings.sarcasmLevel)?.description}
            </Typography>
          </View>
        </GlassCard>

        {/* Marcie Personality */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={GRADIENTS.romanceHub.colors} style={styles.sectionIcon}>
              <Ionicons name="person" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.sectionTitle}>MARCIE'S PERSONALITY</Typography>
              <Typography variant="caption" style={styles.sectionSubtitle}>Choose her therapeutic style</Typography>
            </View>
          </View>

          <View style={styles.personalityGrid}>
            {personalities.map(p => (
              <PersonalityCard 
                key={p.id}
                personality={p}
                selected={settings.marciePersonality === p.id}
                onPress={() => updateSetting('marciePersonality', p.id)}
              />
            ))}
          </View>
        </GlassCard>

        {/* Game Preferences */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={[COLORS.brightYellow, COLORS.warmOrange]} style={styles.sectionIcon}>
              <Ionicons name="game-controller" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.sectionTitle}>GAME PREFERENCES</Typography>
              <Typography variant="caption" style={styles.sectionSubtitle}>How you like to play</Typography>
            </View>
          </View>

          <PreferenceSlider 
            label="Game Intensity"
            description="How deep do you want to go?"
            value={settings.gameIntensity === 'gentle' ? 0 : settings.gameIntensity === 'moderate' ? 0.5 : 1}
            minLabel="Gentle"
            maxLabel="Intense"
            onChange={value => {
              const intensity = value < 0.33 ? 'gentle' : value < 0.66 ? 'moderate' : 'intense';
              updateSetting('gameIntensity', intensity);
            }}
            currentLabel={settings.gameIntensity.charAt(0).toUpperCase() + settings.gameIntensity.slice(1)}
          />

          <PreferenceSlider 
            label="Humor Level"
            description="How much levity in serious moments?"
            value={settings.humorLevel === 1 ? 0 : settings.humorLevel === 2 ? 0.5 : 1}
            minLabel="Serious"
            maxLabel="Playful"
            onChange={value => {
              const level = value < 0.33 ? 1 : value < 0.66 ? 2 : 3;
              updateSetting('humorLevel', level);
            }}
            currentLabel={`Level ${settings.humorLevel}`}
          />

          <PreferenceSlider 
            label="Vulnerability Comfort"
            description="How open are you to deep sharing?"
            value={settings.vulnerabilityComfort === 1 ? 0 : settings.vulnerabilityComfort === 2 ? 0.5 : 1}
            minLabel="Guarded"
            maxLabel="Open"
            onChange={value => {
              const level = value < 0.33 ? 1 : value < 0.66 ? 2 : 3;
              updateSetting('vulnerabilityComfort', level);
            }}
            currentLabel={`Level ${settings.vulnerabilityComfort}`}
          />
        </GlassCard>

        {/* Notification Style */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <LinearGradient colors={[COLORS.aquaTeal, COLORS.mintGreen]} style={styles.sectionIcon}>
              <Ionicons name="notifications" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <View>
              <Typography variant="label" style={styles.sectionTitle}>NOTIFICATION STYLE</Typography>
              <Typography variant="caption" style={styles.sectionSubtitle}>How Dr. Marcie wakes you up</Typography>
            </View>
          </View>

          <View style={styles.styleOptions}>
            {[
              { id: 'playful', label: 'Playful', desc: 'Light-hearted with emojis', emoji: '😄' },
              { id: 'direct', label: 'Direct', desc: 'Straight to the point', emoji: '🎯' },
              { id: 'supportive', label: 'Supportive', desc: 'Encouraging and gentle', emoji: '🤗' },
            ].map(style => (
              <StyleOptionCard 
                key={style.id}
                style={style}
                selected={settings.notificationStyle === style.id}
                onPress={() => updateSetting('notificationStyle', style.id)}
              />
            ))}
          </View>
        </GlassCard>

        {/* Preview */}
        <GlassCard style={[styles.sectionCard, styles.previewCard]}>
          <Typography variant="label" style={styles.sectionTitle}>PREVIEW</Typography>
          <Typography variant="caption" style={styles.previewSubtitle}>How Dr. Marcie will sound with your settings</Typography>
          
          <View style={styles.previewBubble}>
            <LinearGradient colors={GRADIENTS.primary.colors} style={styles.previewAvatar}>
              <Ionicons name="person" size={24} color={COLORS.textPrimary} />
            </LinearGradient>
            <Typography variant="body" style={styles.previewText}>
              {getPreviewText(settings)}
            </Typography>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const SarcasmLevelCard = ({ level, selected, onPress }: any) => (
  <TouchableOpacity 
    style={[
      styles.levelCard,
      selected && styles.levelCardSelected,
      { borderColor: getSarcasmColor(level.level) },
    ]}
    onPress={onPress}
  >
    <View style={styles.levelEmoji}>{level.emoji}</View>
    <Typography variant="label" style={styles.levelName}>{level.name}</Typography>
    <Typography variant="caption" style={styles.levelDescription}>{level.description}</Typography>
    <View style={styles.levelNumber}>
      <Typography variant="header" style={{ color: getSarcasmColor(level.level) }}>LEVEL {level.level}</Typography>
    </View>
  </TouchableOpacity>
);

const PersonalityCard = ({ personality, selected, onPress }: any) => (
  <TouchableOpacity 
    style={[
      styles.personalityCard,
      selected && styles.personalityCardSelected,
      { borderColor: getPersonalityColor(personality.id) },
    ]}
    onPress={onPress}
  >
    <View style={styles.personalityEmoji}>{personality.emoji}</View>
    <Typography variant="label" style={styles.personalityName}>{personality.name}</Typography>
    <Typography variant="caption" style={styles.personalityDescription}>{personality.description}</Typography>
  </TouchableOpacity>
);

type PreferenceSliderProps = {
  label: string;
  description: string;
  value: number;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
  currentLabel: string;
};

const PreferenceSlider = ({ label, description, value, minLabel, maxLabel, onChange, currentLabel }: PreferenceSliderProps) => (
  <View style={styles.sliderContainer}>
    <View style={styles.sliderHeader}>
      <View>
        <Typography variant="label" style={styles.sliderLabel}>{label}</Typography>
        <Typography variant="caption" style={styles.sliderDescription}>{description}</Typography>
      </View>
      <Typography variant="label" style={styles.sliderCurrent}>{currentLabel}</Typography>
    </View>
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={1}
      step={0.01}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor={COLORS.vibrantPink}
      maximumTrackTintColor={COLORS.borderSubtle}
    />
    <View style={styles.sliderLabels}>
      <Typography variant="caption" style={styles.sliderMinLabel}>{minLabel}</Typography>
      <Typography variant="caption" style={styles.sliderMaxLabel}>{maxLabel}</Typography>
    </View>
  </View>
);

const StyleOptionCard = ({ style, selected, onPress }: any) => (
  <TouchableOpacity 
    style={[
      styles.styleCard,
      selected && styles.styleCardSelected,
      { borderColor: getStyleColor(style.id) },
    ]}
    onPress={onPress}
  >
    <View style={styles.styleEmoji}>{style.emoji}</View>
    <Typography variant="label" style={styles.styleName}>{style.label}</Typography>
    <Typography variant="caption" style={styles.styleDescription}>{style.desc}</Typography>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    marginTop: SPACING.tiny,
  },
  levelSelector: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  levelCard: {
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  levelCardSelected: {
    borderWidth: 2,
    backgroundColor: COLORS.vibrantPink + '10',
  },
  levelEmoji: {
    fontSize: 32,
    marginBottom: SPACING.regular,
  },
  levelName: {
    marginBottom: SPACING.tiny,
  },
  levelDescription: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
    lineHeight: 20,
  },
  levelNumber: {
    alignSelf: 'flex-end',
  },
  currentLevel: {
    padding: SPACING.regular,
    backgroundColor: COLORS.vibrantPink + '10',
    borderRadius: BORDER_RADIUS.large,
  },
  currentLabel: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.small,
  },
  currentDescription: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  personalityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  personalityCard: {
    width: '48%',
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  personalityCardSelected: {
    borderWidth: 2,
    backgroundColor: COLORS.vibrantPink + '10',
  },
  personalityEmoji: {
    fontSize: 40,
    marginBottom: SPACING.regular,
  },
  personalityName: {
    textAlign: 'center',
    marginBottom: SPACING.tiny,
  },
  personalityDescription: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  sliderContainer: {
    marginBottom: SPACING.xlarge,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  sliderLabel: {
    marginBottom: SPACING.tiny,
  },
  sliderDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  sliderCurrent: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.regular,
  },
  sliderMinLabel: {
    color: COLORS.textHint,
  },
  sliderMaxLabel: {
    color: COLORS.textHint,
  },
  styleOptions: {
    gap: SPACING.regular,
  },
  styleCard: {
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  styleCardSelected: {
    borderWidth: 2,
    backgroundColor: COLORS.vibrantPink + '10',
  },
  styleEmoji: {
    fontSize: 32,
    marginBottom: SPACING.regular,
  },
  styleName: {
    marginBottom: SPACING.tiny,
  },
  styleDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  previewCard: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink + '40',
    backgroundColor: COLORS.vibrantPink + '08',
  },
  previewSubtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xlarge,
  },
  previewBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewText: {
    flex: 1,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

function getSarcasmColor(level: number) {
  const colors = { 1: COLORS.mintGreen, 2: COLORS.aquaTeal, 3: COLORS.warmOrange, 4: COLORS.error };
  return colors[level as keyof typeof colors] || COLORS.vibrantPink;
}

function getPersonalityColor(id: string) {
  const colors: Record<string, string> = {
    warm: COLORS.rosePink,
    balanced: COLORS.aquaTeal,
    clinical: COLORS.mintGreen,
    oracle: COLORS.lavenderPurple,
  };
  return colors[id] || COLORS.vibrantPink;
}

function getStyleColor(id: string) {
  const colors: Record<string, string> = {
    playful: COLORS.warmOrange,
    direct: COLORS.aquaTeal,
    supportive: COLORS.mintGreen,
  };
  return colors[id] || COLORS.vibrantPink;
}

function getPreviewText(settings: any) {
  const sarcasm = ['Mild', 'Sharp', 'Cutting', 'Prophetic'][settings.sarcasmLevel - 1];
  const personality = { warm: 'warmly', balanced: 'directly', clinical: 'analytically', oracle: 'mystically' }[settings.marciePersonality as 'warm' | 'balanced' | 'clinical' | 'oracle'];
  const style = { playful: 'playfully', direct: 'directly', supportive: 'supportively' }[settings.notificationStyle as 'playful' | 'direct' | 'supportive'];
  
  return `"Listen up, darling. I'm feeling ${sarcasm.toLowerCase()} today and I'll speak to you ${personality}, but ${style}. Your trust is at ${Math.round(65 + Math.random() * 20)}% — let's fix what's broken."`;
}