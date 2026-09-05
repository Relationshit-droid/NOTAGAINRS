import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type SOSResultsSummaryProps = {
  navigation: any;
  route: any;
};

interface SummaryData {
  sessionId: string;
  coupleId: string;
  repairId: string;
  verdict: any;
  answers: Record<string, string>;
  mutualAgreement: boolean;
  pointsEarned: number;
  trustChange: number;
  completedAt: string;
}

export default function SOSResultsSummary({ navigation, route }: SOSResultsSummaryProps) {
  const { sessionId, coupleId, repairId, verdict, answers } = route.params || {};
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Conflict resolved. Growth recorded. You're stronger now.");

  useEffect(() => {
    // Calculate summary from verdict and answers
    const yesCount = Object.values(answers || {}).filter(v => v === 'yes').length;
    const mutualAgreement = yesCount >= 3; // 3+ yes answers
    const pointsEarned = mutualAgreement ? 50 : 25;
    const trustChange = mutualAgreement ? 2 : 1;

    setSummary({
      sessionId: sessionId || '',
      coupleId: coupleId || '',
      repairId: repairId || '',
      verdict,
      answers: answers || {},
      mutualAgreement,
      pointsEarned,
      trustChange,
      completedAt: new Date().toISOString(),
    });

    // Update Marcie quote based on outcome
    if (mutualAgreement) {
      setMarcieQuote("Both of you showed up. That's how trust is built. +2% Trust Thermometer.");
    } else {
      setMarcieQuote("Partial progress. The work continues. +1% Trust Thermometer.");
    }
  }, [answers, verdict]);

  const handleDone = () => {
    navigation.popToTop(); // Return to home
  };

  if (!summary) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <SafeAreaView style={styles.loadingContainer}>
          <Typography variant="body" color={COLORS.textSecondary}>Compiling results...</Typography>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  const { mutualAgreement, pointsEarned, trustChange, completedAt } = summary;

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={true}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.outcomeBadge, { backgroundColor: mutualAgreement ? `${COLORS.success}20` : `${COLORS.warning}20` }]}>
              <Ionicons 
                name={mutualAgreement ? 'checkmark-circle' : 'refresh'} 
                size={32} 
                color={mutualAgreement ? COLORS.success : COLORS.warning} 
              />
            </View>
            <Typography variant="h1" style={styles.title}>
              {mutualAgreement ? 'REPAIR SUCCESSFUL' : 'PARTIAL PROGRESS'}
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Session completed • {new Date(completedAt).toLocaleTimeString()}
            </Typography>
          </View>

          {/* Points Earned */}
          <GlassCard style={styles.pointsCard} padding="large">
            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <Typography variant="label" style={styles.pointsLabel}>VULNERABILITY POINTS</Typography>
                <Typography variant="h1" style={{ color: COLORS.vibrantPink }}>+{pointsEarned}</Typography>
              </View>
              <View style={styles.pointsDivider} />
              <View style={styles.pointsItem}>
                <Typography variant="label" style={styles.pointsLabel}>TRUST THERMOMETER</Typography>
                <Typography variant="h1" style={{ color: COLORS.aquaTeal }}>+{trustChange}%</Typography>
              </View>
              <View style={styles.pointsDivider} />
              <View style={styles.pointsItem}>
                <Typography variant="label" style={styles.pointsLabel}>CONNECTION POINTS</Typography>
                <Typography variant="h1" style={{ color: COLORS.brightYellow }}>+{Math.floor(pointsEarned * 0.5)}</Typography>
              </View>
            </View>
          </GlassCard>

          {/* Questionnaire Results */}
          <Typography variant="label" style={styles.sectionTitle}>CHECK-IN RESULTS</Typography>
          
          <View style={styles.resultsContainer}>
            {Object.entries(answers || {}).map(([questionId, answer], index) => {
              const questionText = getQuestionText(questionId);
              const isPositive = answer === 'yes';
              return (
                <GlassCard key={questionId} style={styles.resultCard} padding="medium">
                  <View style={styles.resultRow}>
                    <View style={[
                      styles.resultIcon,
                      { backgroundColor: isPositive ? `${COLORS.success}20` : 
                                   answer === 'maybe' ? `${COLORS.warning}20` : `${COLORS.error}20` }
                    ]}>
                      <Ionicons 
                        name={isPositive ? 'checkmark' : answer === 'maybe' ? 'help' : 'close'} 
                        size={20} 
                        color={isPositive ? COLORS.success : answer === 'maybe' ? COLORS.warning : COLORS.error} 
                      />
                    </View>
                    <View style={styles.resultTextContainer}>
                      <Typography variant="label" style={styles.resultQuestion}>{questionText}</Typography>
                      <Typography variant="caption" style={[
                        styles.resultAnswer,
                        { color: isPositive ? COLORS.success : answer === 'maybe' ? COLORS.warning : COLORS.error }
                      ]}>
                        {answer.charAt(0).toUpperCase() + answer.slice(1)}
                      </Typography>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>

          {/* Key Learnings */}
          {verdict && (
            <>
              <Typography variant="label" style={styles.sectionTitle}>KEY LEARNINGS</Typography>
              
              <GlassCard style={styles.learningCard} padding="large">
                <View style={styles.learningRow}>
                  <View style={[styles.learningIcon, { backgroundColor: `${COLORS.aquaTeal}20` }]}>
                    <Ionicons name="lightbulb" size={28} color={COLORS.aquaTeal} />
                  </View>
                  <View style={styles.learningContent}>
                    <Typography variant="label" style={styles.learningTitle}>THE CORE ISSUE</Typography>
                    <Typography variant="body" style={styles.learningText}>{verdict.realityCheck}</Typography>
                  </View>
                </View>
              </GlassCard>

              <GlassCard style={styles.learningCard} padding="large">
                <View style={styles.learningRow}>
                  <View style={[styles.learningIcon, { backgroundColor: `${COLORS.vibrantPink}20` }]}>
                    <Ionicons name="person" size={28} color={COLORS.vibrantPink} />
                  </View>
                  <View style={styles.learningContent}>
                    <Typography variant="label" style={styles.learningTitle}>YOUR PATTERN</Typography>
                    <Typography variant="body" style={styles.learningText}>{mutualAgreement ? 'You\'re learning to communicate needs clearly' : 'Work on expressing feelings without blame'}</Typography>
                  </View>
                </View>
              </GlassCard>
            </>
          )}

          {/* Next Steps */}
          <Typography variant="label" style={styles.sectionTitle}>NEXT STEPS</Typography>
          
          <GlassCard style={styles.nextStepsCard} padding="large">
            <View style={styles.nextStepsList}>
              <View style={styles.nextStep}>
                <Typography variant="label" style={styles.nextStepNumber}>1</Typography>
                <Typography variant="body" style={styles.nextStepText}>
                  Schedule a 15-min follow-up conversation within 24 hours
                </Typography>
              </View>
              <View style={styles.nextStep}>
                <Typography variant="label" style={styles.nextStepNumber}>2</Typography>
                <Typography variant="body" style={styles.nextStepText}>
                  Practice the repair technique 3x this week
                </Typography>
              </View>
              <View style={styles.nextStep}>
                <Typography variant="label" style={styles.nextStepNumber}>3</Typography>
                <Typography variant="body" style={styles.nextStepText}>
                  Play a Connection game together to rebuild warmth
                </Typography>
              </View>
            </View>
          </GlassCard>

          {/* Done Button */}
          <SquishyButton 
            onPress={handleDone}
            variant="primary"
            size="large"
            style={styles.doneButton}
          >
            <Typography variant="button">DONE - RETURN HOME</Typography>
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

function getQuestionText(questionId: string): string {
  const questions: Record<string, string> = {
    helped: 'Did the repair attempt help?',
    heard: 'Do you feel heard?',
    specific: 'Was the repair specific enough?',
    core_issue: 'Did it address the core issue?',
    try_again: 'Would you try this repair again?',
  };
  return questions[questionId] || questionId;
}

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
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  outcomeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
  },
  pointsCard: {
    marginBottom: SPACING.xlarge,
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pointsItem: {
    alignItems: 'center',
    flex: 1,
  },
  pointsLabel: {
    textAlign: 'center',
    marginBottom: SPACING.tiny,
    opacity: 0.7,
  },
  pointsDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.borderSubtle,
  },
  sectionTitle: {
    textAlign: 'center',
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.regular,
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  resultsContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  resultCard: {
    width: '100%',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextContainer: {
    flex: 1,
  },
  resultQuestion: {
    marginBottom: SPACING.tiny,
  },
  resultAnswer: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  learningCard: {
    marginBottom: SPACING.regular,
  },
  learningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
  },
  learningIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.tiny,
  },
  learningContent: {
    flex: 1,
  },
  learningTitle: {
    marginBottom: SPACING.small,
    color: COLORS.aquaTeal,
  },
  learningText: {
    lineHeight: 24,
  },
  nextStepsCard: {
    marginBottom: SPACING.xxlarge,
  },
  nextStepsList: {
    gap: SPACING.regular,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
  },
  nextStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.vibrantPink,
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 2,
  },
  nextStepText: {
    flex: 1,
    lineHeight: 22,
    marginTop: SPACING.tiny,
  },
  doneButton: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xxlarge,
  },
});