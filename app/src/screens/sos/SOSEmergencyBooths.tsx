import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { sosApi } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { Ionicons } from '@expo/vector-icons';

type SOSEmergencyBoothsProps = {
  navigation: any;
  route: any;
};

interface BoothSubmission {
  i_feel: string;
  when_partner: string;
  because_i_tell_myself: string;
  what_i_need: string;
}

const EMOTIONS = [
  'Angry', 'Hurt', 'Scared', 'Lonely', 
  'Frustrated', 'Disappointed', 'Confused', 
  'Betrayed', 'Ignored', 'Stressed'
];

export default function SOSEmergencyBooths({ navigation, route }: SOSEmergencyBoothsProps) {
  const { coupleId } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [submissions, setSubmissions] = useState<Record<string, BoothSubmission>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Spill it. No filters. No edits. Just truth.");

  const formData: BoothSubmission = {
    i_feel: '',
    when_partner: '',
    because_i_tell_myself: '',
    what_i_need: '',
  };

  // Initialize SOS session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !coupleId) {
          Alert.alert('Error', 'Missing authentication or couple ID');
          navigation.goBack();
          return;
        }

        const token = await user.getIdToken();
        const session = await sosApi.createSession(user.uid, coupleId, token);
        setSessionId(session.id);
        
        // TODO: Set up real-time listener for partner joining
        // For now, simulate partner joining after 3 seconds
        setTimeout(() => setPartnerJoined(true), 3000);
      } catch (error) {
        console.error('Failed to create SOS session:', error);
        Alert.alert('Error', 'Failed to start emergency session');
        navigation.goBack();
      }
    };

    initSession();
  }, [coupleId]);

  const steps = [
    { field: 'i_feel', label: 'I Feel...', inputType: 'dropdown', placeholder: 'Select your emotion', helper: 'Name the feeling you\'re experiencing right now' },
    { field: 'when_partner', label: 'When My Partner...', inputType: 'text', placeholder: 'What specific thing did they do?', helper: 'Describe the behavior, not your interpretation' },
    { field: 'because_i_tell_myself', label: 'Because I Tell Myself...', inputType: 'text', placeholder: 'What story am I telling myself?', helper: 'Identify your internal narrative (e.g., "I\'m not important")' },
    { field: 'what_i_need', label: 'What I Actually Need...', inputType: 'text', placeholder: 'What would help me feel better?', helper: 'Express a specific, actionable need' },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSubmit = async () => {
    if (!sessionId) return;
    
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      await sosApi.submitBooth(sessionId, user.uid, formData, token);
      
      if (isLastStep) {
        // Both partners need to complete - navigate to holding room
        navigation.navigate('SOSHoldingRoom', { sessionId, coupleId });
      } else {
        setCurrentStep(prev => prev + 1);
        // Update Marcie quote for next step
        const quotes = [
          "Good. Now the behavior. Just facts.",
          "The story you're telling yourself. Be honest.",
          "What do you need? Not what you want them to do."
        ];
        setMarcieQuote(quotes[currentStep] || marcieQuote);
      }
    } catch (error) {
      console.error('Failed to submit booth:', error);
      Alert.alert('Error', 'Failed to save your response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmotionSelect = (emotion: string) => {
    if (currentStep === 0) {
      formData.i_feel = emotion;
    }
  };

  const handleTextChange = (text: string) => {
    formData[currentStepData.field as keyof BoothSubmission] = text;
  };

  const canProceed = currentStep === 0 
    ? formData.i_feel.length > 0 
    : formData[currentStepData.field as keyof BoothSubmission].length > 0;

  if (!sessionId) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <SafeAreaView style={styles.loadingContainer}>
          <Typography variant="body" color={COLORS.textSecondary}>Initializing emergency session...</Typography>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={false}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View key={index} style={[
              styles.progressStep,
              index === currentStep && styles.progressStepActive,
              index < currentStep && styles.progressStepComplete,
            ]}>
              <View style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotComplete,
              ]} />
              {index < steps.length - 1 && (
                <View style={[
                  styles.progressLine,
                  index < currentStep && styles.progressLineComplete,
                ]} />
              )}
            </View>
          ))}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={100}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step header */}
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberContainer}>
                <Typography variant="label" style={styles.stepNumber}>
                  STEP {currentStep + 1} OF {steps.length}
                </Typography>
              </View>
            </View>

            <GlassCard style={styles.stepCard} padding="large">
              <View style={styles.stepTitleContainer}>
                <Typography variant="h2" style={styles.stepTitle}>{currentStepData.label}</Typography>
              </View>
              
              <Typography variant="caption" style={styles.stepHelper}>
                {currentStepData.helper}
              </Typography>

              {/* Input based on step type */}
              {currentStepData.inputType === 'dropdown' && (
                <View style={styles.emotionGrid}>
                  {EMOTIONS.map((emotion) => (
                    <TouchableOpacity
                      key={emotion}
                      onPress={() => handleEmotionSelect(emotion)}
                      style={[
                        styles.emotionChip,
                        formData.i_feel === emotion && styles.emotionChipSelected,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Typography 
                        variant="body" 
                        style={[
                          styles.emotionChipText,
                          formData.i_feel === emotion && styles.emotionChipTextSelected,
                        ]}
                      >
                        {emotion}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {currentStepData.inputType === 'text' && (
                <TextInput
                  placeholder={currentStepData.placeholder}
                  placeholderTextColor={COLORS.textHint}
                  value={formData[currentStepData.field as keyof BoothSubmission] as string}
                  onChangeText={handleTextChange}
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                  autoFocus
                />
              )}
            </GlassCard>

            {/* Partner status */}
            <GlassCard style={styles.partnerCard} padding="medium">
              <View style={styles.partnerStatusRow}>
                <View style={[
                  styles.partnerIndicator,
                  partnerJoined && styles.partnerIndicatorJoined,
                ]} />
                <Typography variant="body" style={styles.partnerStatusText}>
                  {partnerJoined ? 'Partner has joined the booth' : 'Waiting for partner to join...'}
                </Typography>
              </View>
            </GlassCard>

            {/* Navigation buttons */}
            <View style={styles.buttonContainer}>
              {!isFirstStep && (
                <SquishyButton 
                  onPress={() => setCurrentStep(prev => prev - 1)}
                  variant="ghost"
                  size="large"
                  style={styles.backButton}
                >
                  <Typography variant="button">BACK</Typography>
                </SquishyButton>
              )}

              <SquishyButton 
                onPress={handleSubmit}
                disabled={!canProceed || isSubmitting}
                variant="primary"
                size="large"
                style={styles.nextButton}
              >
                {isSubmitting ? (
                  <Typography variant="button">SAVING...</Typography>
                ) : isLastStep ? (
                  <Typography variant="button">SUBMIT & WAIT</Typography>
                ) : (
                  <Typography variant="button">NEXT</Typography>
                )}
              </SquishyButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

// Need to import TouchableOpacity
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.large,
    marginBottom: SPACING.large,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.borderSubtle,
  },
  progressDotActive: {
    backgroundColor: COLORS.vibrantPink,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  progressDotComplete: {
    backgroundColor: COLORS.success,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.borderSubtle,
    marginHorizontal: SPACING.small,
  },
  progressLineComplete: {
    backgroundColor: COLORS.success,
  },
  progressStepActive: {},
  progressStepComplete: {},
  stepHeader: {
    marginBottom: SPACING.large,
  },
  stepNumberContainer: {
    alignSelf: 'flex-start',
  },
  stepNumber: {
    color: COLORS.vibrantPink,
    letterSpacing: 1,
  },
  stepCard: {
    width: '100%',
  },
  stepTitleContainer: {
    marginBottom: SPACING.small,
  },
  stepTitle: {
    textAlign: 'center',
  },
  stepHelper: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xlarge,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
    justifyContent: 'center',
  },
  emotionChip: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundInput,
    minWidth: 80,
    alignItems: 'center',
  },
  emotionChipSelected: {
    borderColor: COLORS.vibrantPink,
    backgroundColor: `${COLORS.vibrantPink}20`,
  },
  emotionChipText: {
    color: COLORS.textSecondary,
  },
  emotionChipTextSelected: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  partnerCard: {
    width: '100%',
    marginTop: SPACING.large,
    marginBottom: SPACING.xlarge,
  },
  partnerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  partnerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.warning,
  },
  partnerIndicatorJoined: {
    backgroundColor: COLORS.success,
  },
  partnerStatusText: {
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.regular,
    paddingHorizontal: SPACING.screenPadding,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});