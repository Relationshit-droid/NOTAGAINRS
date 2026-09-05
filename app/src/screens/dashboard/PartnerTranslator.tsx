import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { getSecureAiAnalysis, analyzeFight, generateQuestions } from '../../lib/ai-engine';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { setJSON, getJSON } from '../../lib/cache';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function PartnerTranslator({ navigation }: any) {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [desc, setDesc] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<{ translation: string; plan: string[] } | null>(null);
  const [reportDone, setReportDone] = useState(false);
  const flip = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ rotateY: `${flip.value * 180}deg` }] }));
  const [showQs, setShowQs] = useState(false);
  const [coupleData, setCoupleData] = useState<{ origin_story: any; first_red_flag: string } | null>(null);

  useEffect(() => { getJSON('translator_report_done', false).then(setReportDone); }, []);
  useEffect(() => {
    if (userId) {
      loadCoupleData();
    }
  }, [userId]);

  async function loadCoupleData() {
    try {
      const token = await user?.getIdToken();
      if (!token) return;
      
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple) {
        setCoupleData({
          origin_story: {
            meet_cute: couple.origin_story?.meet_cute || '',
            first_impression: couple.origin_story?.first_impression || '',
            turning_point: couple.origin_story?.turning_point || '',
            current_status: couple.origin_story?.current_status || '',
          },
          first_red_flag: couple.origin_story?.first_red_flag || '',
        });
      }
    } catch (error) {
      console.error('Failed to load couple data:', error);
    }
  }

  async function startInvestigation() {
    if (desc.trim().length < 10) {
      speakMarcie('Give me a bit more context. Describe what happened.');
      return;
    }
    setLoading(true);
    speakMarcie('Investigating... hold tight.');

    try {
      const generatedQs = await generateQuestions(desc, coupleData);
      setQs(generatedQs);
      setLoading(false);
      setShowQs(true);
      setQIndex(0);
      setAnswers([]);
    } catch (error) {
      setLoading(false);
      speakMarcie('Something went wrong. Try again, darling.');
    }
  }

  async function next(val: boolean) {
    const list = [...answers, val];
    setAnswers(list);
    if (qIndex < qs.length - 1) setQIndex(qIndex + 1);
    else await translate(list);
  }

  async function translate(list: boolean[]) {
    setLoading(true);
    
    const qAndA = qs.map((q, i) => `Q: ${q} A: ${list[i] ? 'Yes' : 'No'}`).join('\n');
    const aInput = `Situation: ${desc}\nContext:\n${qAndA}`;

    try {
      const verdict = await analyzeFight({
        origin_story: coupleData?.origin_story?.meet_cute || '',
        first_red_flag: coupleData?.first_red_flag || '',
        partner_a_input: aInput,
        partner_b_input: '{}',
        personality: 'balanced',
        sarcasm_level: 2
      });

      const translation = verdict.callout.join(' ');
      const plan = verdict.repairs_a;

      setResult({ translation, plan });
      setLoading(false);
      speakMarcie(translation);
      await setJSON('translator_last_input', { desc, questions: qs, answers: list });
      await setJSON('translator_last_result', { translation, plan });
      flip.value = withTiming(1, { duration: 600 });
    } catch (error) {
      setLoading(false);
      speakMarcie('Analysis failed. Try again, darling.');
      console.error('Translation error:', error);
    }
  }

  async function markReported() {
    setReportDone(true);
    await setJSON('translator_report_done', true);
  }

  return (
    <ScreenLayout showHeader={true}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <SquishyButton onPress={() => navigation.goBack()} variant="secondary" size="small">
            <Typography variant="button">Back</Typography>
          </SquishyButton>
          <Typography variant="header">Partner Translator</Typography>
          <Typography variant="label">🌐</Typography>
        </View>
        
        <GlassCard>
          {!result && !showQs && (
            <Typography variant="body" style={{ marginBottom: SPACING.regular }}>
              Describe the conflict. I'll translate their nonsense into logic.
            </Typography>
          )}

          {!showQs && !result && (
            <TextInput
              placeholder="My partner said they're 'fine' but slammed the door..."
              style={[styles.input, focused ? styles.inputFocus : undefined]}
              value={desc}
              onChangeText={(t) => setDesc(t.slice(0, 500))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              accessibilityLabel="Describe behavior"
              multiline
              placeholderTextColor={COLORS.textHint}
            />
          )}

          {!showQs && !result && (
            <View style={styles.counterRow}>
              <SquishyButton onPress={() => setDesc('')} variant="ghost" size="small">
                <Typography variant="button">Clear</Typography>
              </SquishyButton>
              <Typography variant="label">{desc.length}/500</Typography>
            </View>
          )}

          {loading && (
            <View style={{ padding: SPACING.xlarge, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={COLORS.vibrantPink} />
              <Typography variant="body" style={{ marginTop: SPACING.regular }}>Analyzing conversational ballistics...</Typography>
            </View>
          )}

          {!result && !showQs && !loading && (
            <SquishyButton onPress={startInvestigation}>
              <Typography variant="button">Start Investigation</Typography>
            </SquishyButton>
          )}

          {!result && showQs && !loading && qs.length > 0 && (
            <View style={styles.cardsRow}>
              <Typography variant="label" style={{ marginBottom: SPACING.regular, textAlign: 'center' }}>
                CLARIFYING QUESTION {qIndex + 1}/{qs.length}
              </Typography>
              <View style={styles.card}>
                <Typography variant="body" style={{ fontSize: TYPOGRAPHY.fontSize.headerSmall, textAlign: 'center' }}>{qs[qIndex]}</Typography>
                <View style={styles.actions}>
                  <SquishyButton onPress={() => next(true)}>
                    <Typography variant="button">YES</Typography>
                  </SquishyButton>
                  <SquishyButton onPress={() => next(false)} variant="ghost">
                    <Typography variant="button">NO</Typography>
                  </SquishyButton>
                </View>
              </View>
            </View>
          )}

          {result && (
            <Animated.View style={[styles.translation, style]}>
              <GlassCard variant="elevated">
                <Typography variant="label" style={{ marginBottom: SPACING.small, color: COLORS.mintGreen }}>
                  OFFICIAL TRANSLATION
                </Typography>
                <Typography variant="marcieDialogue" style={{ textAlign: 'center' }}>
                  "{result.translation}"
                </Typography>

                <Typography variant="label" style={{ marginTop: SPACING.large, marginBottom: SPACING.small }}>
                  RECOMMENDED ACTION PLAN
                </Typography>
                {result.plan.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: SPACING.small }}>
                    <Typography variant="label" style={{ marginRight: SPACING.small }}>{i + 1}.</Typography>
                    <Typography variant="body" style={{ flex: 1 }}>{p}</Typography>
                  </View>
                ))}

                <View style={{ flexDirection: 'row', gap: SPACING.regular, marginTop: SPACING.xlarge, justifyContent: 'center' }}>
                  <SquishyButton onPress={markReported} disabled={reportDone}>
                    <Typography variant="button">{reportDone ? 'Reported' : 'Report Success'}</Typography>
                  </SquishyButton>
                  <SquishyButton 
                    onPress={() => { setShowQs(false); setResult(null); setDesc(''); }} 
                    variant="secondary"
                  >
                    <Typography variant="button">New Case</Typography>
                  </SquishyButton>
                </View>
              </GlassCard>
            </Animated.View>
          )}
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SPACING.screenPadding,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: SPACING.regular 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    marginTop: SPACING.regular, 
    minHeight: 128, 
    textAlignVertical: 'top' 
  },
  inputFocus: { 
    borderColor: COLORS.vibrantPink 
  },
  counterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: SPACING.small 
  },
  cardsRow: { 
    marginTop: SPACING.regular 
  },
  card: { 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    backgroundColor: COLORS.backgroundInput,
    gap: SPACING.regular,
  },
  actions: { 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    marginTop: SPACING.regular, 
    justifyContent: 'center' 
  },
  translation: { 
    marginTop: SPACING.regular 
  },
});
