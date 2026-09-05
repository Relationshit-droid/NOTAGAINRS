import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, PanResponder, GestureResponderHandlers, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Typography, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../lib/api';
import { encryptSensitive } from '../../lib/encryption';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../../utils/haptics';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

type OriginStoryScreenProps = {
  onComplete: (diagnoses: Diagnosis[]) => void;
};

type Diagnosis = { title: string; description: string };

export default function OriginStoryScreen({ onComplete }: OriginStoryScreenProps) {
  const { user, signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [story, setStory] = useState('');
  const [flag, setFlag] = useState('');
  const [score, setScore] = useState(5);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const barX = useSharedValue(0);
  const sliderWidth = useRef(0);

  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.value = withTiming(x, { duration: 0 });
        setScore(Math.max(1, Math.min(10, Math.round((x / sliderWidth.current) * 10))));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.value = withTiming(x, { duration: 0 });
        setScore(Math.max(1, Math.min(10, Math.round((x / sliderWidth.current) * 10))));
      },
    }).panHandlers;
  }, []);

  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: Math.max(0, Math.min(barX.value, sliderWidth.current - 24)) }] }));

  const handleSignUpAndSave = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      const token = await user?.getIdToken();
      if (token) {
        await userApi.update(user!.uid, {
          origin_story: encryptSensitive(story, user!.uid),
          first_red_flag: encryptSensitive(flag, user!.uid),
          relationship_score: score,
          sarcasm_level: 1,
        }, token);
      }
      onComplete(generateDiagnoses(story, flag, score));
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  function next() {
    Haptics.selectionAsync();
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSignUpAndSave();
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 0:
        return {
          stepLabel: '1 of 3',
          progress: '33%',
          title: 'Step 1: Meet Cute',
          subtitle: 'Every great love story has a beginning. How did you two first meet?',
          inputLabel: 'OUR STORY',
          placeholder: 'It was a rainy Tuesday at a coffee shop... or maybe a digital spark?',
          value: story,
          setValue: setStory,
          isSlider: false
        };
      case 1:
        return {
          stepLabel: '2 of 3',
          progress: '66%',
          title: 'Step 2: First Red Flag',
          subtitle: 'When was the first time you thought "Uh oh"?',
          inputLabel: 'THE INCIDENT',
          placeholder: 'That time when...',
          value: flag,
          setValue: setFlag,
          isSlider: false
        };
      case 2:
        return {
          stepLabel: '3 of 3',
          progress: '100%',
          title: 'Step 3: Current Vibe',
          subtitle: 'Scale of "The Notebook" to "Gone Girl"',
          inputLabel: 'RELATIONSHIP METER',
          placeholder: '',
          value: '',
          setValue: () => { },
          isSlider: true
        };
      default: return {};
    }
  };

  const content = getStepContent();

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Ionicons name="infinite" size={24} color={COLORS.vibrantPink} />
              <Typography variant="header">RELATIONSHIT!</Typography>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Typography variant="label" style={styles.progressTitle}>THE JOURNEY BEGINS</Typography>
              <Typography variant="body" style={styles.progressCount}>{content.stepLabel}</Typography>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: content.progress as any }]} />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Typography variant="header" style={styles.title}>{content.title}</Typography>
            <Typography variant="body" style={styles.subtitle}>{content.subtitle}</Typography>
          </View>

          <GlassCard style={styles.card}>
            {content.isSlider ? (
              <View style={styles.sliderSection}>
                <Typography variant="label" style={styles.label}>{content.inputLabel}</Typography>
                <View style={styles.sliderWrapper}>
                  <View style={styles.slider} onLayout={(e) => (sliderWidth.current = e.nativeEvent.layout.width)} {...pan}>
                    <View style={styles.track} />
                    <Animated.View style={[styles.knob, knob]} />
                  </View>
                  <View style={styles.scoreDisplay}>
                    <Typography variant="header" style={styles.scoreText}>{score}/10</Typography>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.inputSection}>
                <View style={styles.labelRow}>
                  <Typography variant="label" style={styles.label}>{content.inputLabel}</Typography>
                  <Typography variant="caption" style={styles.hint}>Take your time...</Typography>
                </View>
                <TextInput
                  style={styles.textArea}
                  multiline
                  placeholder={content.placeholder}
                  placeholderTextColor={COLORS.textHint}
                  value={content.value}
                  onChangeText={content.setValue}
                  textAlignVertical="top"
                />
              </View>
            )}
          </GlassCard>

          {step === 0 && (
            <View style={styles.authInputs}>
              <TextInput
                style={styles.authInput}
                placeholder="Email"
                placeholderTextColor={COLORS.textHint}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.authInput}
                placeholder="Password (min 8 chars)"
                placeholderTextColor={COLORS.textHint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="newPassword"
              />
            </View>
          )}

          <View style={styles.footer}>
            <SquishyButton onPress={next} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <>
                  <Typography variant="button">{step === 2 ? 'Complete' : 'Continue'}</Typography>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.textPrimary} />
                </>
              )}
            </SquishyButton>
          </View>

          <View style={{ height: SPACING.xxlarge }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

function generateDiagnoses(story: string, flag: string, score: number): Diagnosis[] {
  return [
    { title: 'Tough Love Rookie', description: 'Sarcasm level 1. Mild side-eye recommended.' },
    { title: 'Patterns on Parade', description: 'Noticing recurring themes. Clipboard tapping intensifies.' },
    { title: 'Trust Thermometer Flicker', description: `Score ${score}/10. Needs calibration.` },
  ];
}

const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: SPACING.screenPadding 
  },
  header: { 
    paddingVertical: SPACING.regular, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.divider, 
    marginBottom: SPACING.large 
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  progressContainer: { 
    marginBottom: SPACING.xlarge, 
    gap: SPACING.small 
  },
  progressLabels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end' 
  },
  progressTitle: { 
    color: COLORS.textSecondary 
  },
  progressCount: { 
    color: COLORS.vibrantPink 
  },
  progressBarBg: { 
    height: 6, 
    backgroundColor: COLORS.divider, 
    borderRadius: BORDER_RADIUS.medium, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: COLORS.vibrantPink, 
    borderRadius: BORDER_RADIUS.medium 
  },
  titleContainer: { 
    alignItems: 'center', 
    marginBottom: SPACING.large, 
    gap: SPACING.small 
  },
  title: { 
    textAlign: 'center' 
  },
  subtitle: { 
    textAlign: 'center', 
    color: COLORS.softViolet 
  },
  card: { 
    padding: SPACING.xlarge 
  },
  inputSection: { 
    gap: SPACING.regular 
  },
  labelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  label: { 
    color: COLORS.textSecondary 
  },
  hint: { 
    color: COLORS.textHint 
  },
  textArea: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.large, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    minHeight: 150 
  },
  sliderSection: { 
    gap: SPACING.large 
  },
  sliderWrapper: { 
    alignItems: 'center' 
  },
  slider: { 
    width: '100%', 
    height: 40, 
    justifyContent: 'center' 
  },
  track: { 
    height: 4, 
    backgroundColor: COLORS.divider, 
    borderRadius: BORDER_RADIUS.small, 
    width: '100%', 
    position: 'absolute' 
  },
  knob: { 
    width: 32, 
    height: 32, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.vibrantPink, 
    ...SHADOWS.neon 
  },
  scoreDisplay: { 
    marginTop: SPACING.large 
  },
  scoreText: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge 
  },
  footer: { 
    marginTop: SPACING.xlarge, 
    alignItems: 'flex-end' 
  },
  authInputs: {
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
    gap: SPACING.regular,
  },
  authInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  }
});