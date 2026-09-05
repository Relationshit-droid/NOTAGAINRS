import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { sosApi } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { Ionicons } from '@expo/vector-icons';
import { speakMarcie } from '../../lib/voice-engine';

type SOSVerdictScreenProps = {
  navigation: any;
  route: any;
};

interface VerdictData {
  whatRightA: string;
  whatRightB: string;
  callOutA: string;
  callOutB: string;
  realityCheck: string;
  whoApologizes: 'A' | 'B' | 'both' | 'neither';
  repairSteps: string[];
}

export default function SOSVerdictScreen({ navigation, route }: SOSVerdictScreenProps) {
  const { sessionId, coupleId } = route.params || {};
  const [verdict, setVerdict] = useState<VerdictData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Here's what I observed. Remember, growth comes from awareness.");

  useEffect(() => {
    const loadVerdict = async () => {
      if (!sessionId) {
        setError('Missing session ID');
        setLoading(false);
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');

        const token = await user.getIdToken();
        
        // First, trigger analysis if not already done
        await sosApi.analyzeSession(sessionId, token);
        
        // Then get the session with verdict
        const session = await sosApi.getSession(sessionId, token);
        
        if (session.verdict) {
          setVerdict(session.verdict);
          
          // Speak the first call-out
          if (session.verdict.callOutA) {
            setTimeout(() => speakMarcie(session.verdict.callOutA), 500);
          }
        } else {
          // Verdict not ready yet
          setError('Verdict not yet generated. Please wait in the holding room.');
        }
      } catch (err: any) {
        console.error('Failed to load verdict:', err);
        setError(err.message || 'Failed to load verdict');
      } finally {
        setLoading(false);
      }
    };

    loadVerdict();
  }, [sessionId]);

  const handleNavigateToRepair = () => {
    if (!verdict) return;
    navigation.navigate('SOSRepairSelection', { 
      sessionId, 
      coupleId, 
      verdict,
      repairSteps: verdict.repairSteps 
    });
  };

  if (loading) {
    return (
      <ScreenLayout 
        showHeader={false} 
        scrollable={false}
        showMarcie={showMarcie}
        marcieQuote="Analyzing the conflict patterns..."
      >
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.vibrantPink} style={styles.loader} />
          <Typography variant="h2" style={styles.loadingTitle}>Consulting the Oracle...</Typography>
          <Typography variant="body" style={styles.loadingSub}>Dr. Marcie is reading the emotional tea leaves.</Typography>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  if (error || !verdict) {
    return (
      <ScreenLayout 
        showHeader={false} 
        scrollable={false}
        showMarcie={showMarcie}
        marcieQuote="Something went wrong. Let's try again."
      >
        <SafeAreaView style={styles.errorContainer}>
          <Typography variant="h2" style={styles.errorTitle}>Unable to Load Verdict</Typography>
          <Typography variant="body" style={styles.errorText}>{error || 'No verdict available'}</Typography>
          <View style={styles.errorButtons}>
            <SquishyButton 
              onPress={() => navigation.goBack()} 
              variant="ghost"
              size="large"
            >
              <Typography variant="button">BACK TO HOLDING ROOM</Typography>
            </SquishyButton>
            <SquishyButton 
              onPress={() => navigation.navigate('SOSHoldingRoom', { sessionId, coupleId })} 
              variant="primary"
              size="large"
            >
              <Typography variant="button">WAIT LONGER</Typography>
            </SquishyButton>
          </View>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  // Determine current user's role (A or B) - simplified for now
  const isUserA = true; // In production, determine from couple data
  const userRight = isUserA ? verdict.whatRightA : verdict.whatRightB;
  const userCallOut = isUserA ? verdict.callOutA : verdict.callOutB;
  const partnerRight = isUserA ? verdict.whatRightB : verdict.whatRightA;
  const partnerCallOut = isUserA ? verdict.callOutB : verdict.callOutA;

  const apologyDirection = verdict.whoApologizes;
  const userOwesApology = (apologyDirection === 'A' && isUserA) || 
                          (apologyDirection === 'B' && !isUserA) ||
                          apologyDirection === 'both';

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
            <Typography variant="h1" style={styles.title}>THE VERDICT</Typography>
            <Typography variant="body" style={styles.subtitle}>Dr. Marcie has thoughts.</Typography>
          </View>

          {/* Reality Check */}
          <GlassCard style={styles.realityCard} padding="large">
            <View style={styles.realityHeader}>
              <View style={[styles.realityIcon, { backgroundColor: `${COLORS.aquaTeal}20` }]}>
                <Ionicons name="flash" size={28} color={COLORS.aquaTeal} />
              </View>
              <Typography variant="h3" style={styles.realityTitle}>THE REALITY CHECK</Typography>
            </View>
            <Typography variant="marcieDialogue" style={styles.realityText}>
              "{verdict.realityCheck}"
            </Typography>
          </GlassCard>

          {/* What You Did Right */}
          <GlassCard style={[styles.verdictCard, { borderColor: COLORS.success }]} padding="large">
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${COLORS.success}20` }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.success }}>WHAT YOU DID RIGHT</Typography>
            </View>
            <Typography variant="body" style={styles.verdictItem}>{userRight}</Typography>
          </GlassCard>

          {/* The Call-Out */}
          <GlassCard style={[styles.verdictCard, { borderColor: COLORS.error }]} padding="large">
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${COLORS.error}20` }]}>
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.error }}>THE CALL-OUT</Typography>
            </View>
            <Typography variant="body" style={[styles.verdictItem, { color: COLORS.error }]}>
              {userCallOut}
            </Typography>
          </GlassCard>

          {/* What Partner Did Right */}
          <GlassCard style={[styles.verdictCard, { borderColor: COLORS.success, opacity: 0.7 }]} padding="large">
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${COLORS.success}20` }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.success }}>WHAT THEY DID RIGHT</Typography>
            </View>
            <Typography variant="body" style={styles.verdictItem}>{partnerRight}</Typography>
          </GlassCard>

          {/* Partner's Call-Out */}
          <GlassCard style={[styles.verdictCard, { borderColor: COLORS.error, opacity: 0.7 }]} padding="large">
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: `${COLORS.error}20` }]}>
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.error }}>THEIR CALL-OUT</Typography>
            </View>
            <Typography variant="body" style={[styles.verdictItem, { color: COLORS.error }]}>
              {partnerCallOut}
            </Typography>
          </GlassCard>

          {/* Apology Direction */}
          <GlassCard style={styles.apologyCard} padding="large">
            <View style={styles.apologyHeader}>
              <View style={[styles.apologyIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                <Ionicons name="person-outline" size={24} color={COLORS.warning} />
              </View>
              <Typography variant="h3" style={styles.apologyTitle}>WHO OWES AN APOLOGY</Typography>
            </View>
            
            <View style={styles.apologyVisual}>
              <View style={[
                styles.apologyAvatar,
                userOwesApology && styles.apologyAvatarGlow,
              ]}>
                <Typography variant="h2">YOU</Typography>
                {userOwesApology && (
                  <View style={styles.apologyBadge}>
                    <Ionicons name="arrow-down" size={20} color={COLORS.error} />
                  </View>
                )}
              </View>
              
              <View style={styles.apologyArrow}>
                <Typography variant="h1" color={COLORS.warning}>→</Typography>
              </View>
              
              <View style={[
                styles.apologyAvatar,
                (!userOwesApology && apologyDirection !== 'neither') && styles.apologyAvatarGlow,
              ]}>
                <Typography variant="h2">THEM</Typography>
                {!userOwesApology && apologyDirection !== 'neither' && (
                  <View style={styles.apologyBadge}>
                    <Ionicons name="arrow-down" size={20} color={COLORS.error} />
                  </View>
                )}
              </View>
            </View>

            <Typography variant="body" style={styles.apologyText} textAlign="center">
              {apologyDirection === 'neither' 
                ? 'No apology needed. This was a misunderstanding.'
                : apologyDirection === 'both'
                ? 'You both owe each other an apology. Start with yourself.'
                : userOwesApology
                ? 'You owe the apology. Own it without "but."'
                : 'They owe the apology. Receive it with grace.'}
            </Typography>
          </GlassCard>

          {/* Repair Steps */}
          <Typography variant="label" style={styles.repairsTitle}>REPAIR ATTEMPTS</Typography>
          <Typography variant="caption" style={styles.repairsSubtitle}>
            Choose one to execute together
          </Typography>

          <View style={styles.repairsContainer}>
            {verdict.repairSteps.map((step, index) => (
              <GlassCard key={index} style={styles.repairCard} padding="large">
                <View style={styles.repairRow}>
                  <View style={styles.repairNumber}>
                    <Typography variant="h3" color={COLORS.vibrantPink}>{index + 1}</Typography>
                  </View>
                  <Typography variant="body" style={styles.repairText} flex={1}>
                    {step}
                  </Typography>
                </View>
              </GlassCard>
            ))}
          </View>

          {/* Action Button */}
          <SquishyButton 
            onPress={handleNavigateToRepair}
            variant="primary"
            size="large"
            style={styles.actionButton}
          >
            <Typography variant="button">CHOOSE REPAIR & EXECUTE</Typography>
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
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
    padding: SPACING.large,
  },
  loader: {
    marginBottom: SPACING.large,
  },
  loadingTitle: {
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  loadingSub: {
    opacity: 0.6,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.xlarge,
  },
  errorButtons: {
    width: '100%',
    gap: SPACING.regular,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.small,
    letterSpacing: 2,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
  },
  realityCard: {
    marginBottom: SPACING.large,
    borderWidth: 2,
    borderColor: COLORS.aquaTeal,
  },
  realityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  realityIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  realityTitle: {
    color: COLORS.aquaTeal,
  },
  realityText: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  verdictCard: {
    marginBottom: SPACING.large,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
    paddingBottom: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.textPrimary}10`,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictItem: {
    lineHeight: 24,
  },
  apologyCard: {
    marginBottom: SPACING.large,
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  apologyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
    justifyContent: 'center',
  },
  apologyIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apologyTitle: {
    color: COLORS.warning,
  },
  apologyVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xlarge,
    marginBottom: SPACING.xlarge,
  },
  apologyAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  apologyAvatarGlow: {
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  apologyBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apologyArrow: {
    paddingHorizontal: SPACING.regular,
  },
  apologyText: {
    lineHeight: 24,
  },
  repairsTitle: {
    textAlign: 'center',
    marginTop: SPACING.xlarge,
    marginBottom: SPACING.small,
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  repairsSubtitle: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.large,
  },
  repairsContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.xxlarge,
  },
  repairCard: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  repairRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.regular,
  },
  repairNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.vibrantPink}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repairText: {
    lineHeight: 24,
    marginTop: SPACING.tiny,
  },
  actionButton: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xxlarge,
  },
});