import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { Audio } from 'expo-av';
import { speakMarcie } from '../../lib/voice-engine';
import { useAppStore } from '../../state/store';
import { COLORS, SPACING, BORDER_RADIUS, ANIMATIONS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function LieDetector({ route, navigation }: any) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // Get game info from registry
  const gameInfo = getGameByScreen('LieDetector');
  const GAME_ID = gameInfo?.id || 'lie-detector';
  const CATEGORY_ID = gameInfo?.categoryId || 'creative-chaos';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);

  useEffect(() => {
    speakMarcie("Partner, record your answer. I'm listening for fluency, steadiness, and filler words. Don't lie to me.");
  }, []);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    analyzeRecording(uri);
  }

  async function analyzeRecording(uri: string | null) {
    setAnalyzing(true);
    // Mock analysis since we don't have a real backend ML service connected for this demo
    setTimeout(async () => {
      const fluency = Math.floor(Math.random() * 10) + 1; // 1-10
      const steadiness = Math.floor(Math.random() * 10) + 1;
      const fillerWords = Math.floor(Math.random() * 5); // 0-5

      const score = (fluency * 2) + (steadiness * 2) - (fillerWords * 2);
      const total = Math.max(0, Math.min(25, 15 + Math.floor(Math.random() * 10))); // Mock total score / 25

      const analysisResult = {
        fluency,
        steadiness,
        fillerWords,
        score: total,
        passed: total > 18
      };

      setResult(analysisResult);
      setAnalyzing(false);

      // Update score during analysis
      await updateScore(total * 4, [{ fluency, steadiness, fillerWords, passed: total > 18 }]);

      if (total > 20) {
        speakMarcie("Ooh—24/25. Only slipped on 'uh' once. I'll allow it… this time.");
      } else {
        speakMarcie("Hmm. Too many pauses. Are you hiding something, or just thinking?");
      }

      // Complete game after analysis
      await completeGame(total * 4, [{
        fluency,
        steadiness,
        fillerWords,
        score: total,
        passed: total > 18,
        recordingUri: uri
      }]);
    }, ANIMATIONS.duration.slower);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Calibrating lie detector...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Initializing session...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="ghost" size="small">
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">Lie Detector: Lite™</Typography>
        </View>

        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}

        <GlassCard style={styles.card}>
          <Typography variant="body" style={styles.prompt}>
            Partner A asks: "What's one thing you almost didn't tell me this week?"
          </Typography>
          <Typography variant="caption" style={styles.subPrompt}>
            Partner B: Hold the button and answer honestly. ≤10 seconds.
          </Typography>
        </GlassCard>

        <View style={styles.recordContainer}>
          <SquishyButton
            onPress={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
            style={[styles.recordBtn, recording ? styles.recording : {}]}
            variant={recording ? 'secondary' : 'primary'}
            size="large"
          >
            <Typography variant="h2">{recording ? 'Tap to Stop' : 'Tap to Record'}</Typography>
          </SquishyButton>
        </View>

        {analyzing && (
          <GlassCard style={styles.resultCard}>
            <Typography variant="h2">Analyzing Prosody...</Typography>
            <Typography variant="body">Checking pitch variance...</Typography>
            <Typography variant="body">Detecting hesitation...</Typography>
          </GlassCard>
        )}

        {result && !analyzing && (
          <GlassCard style={styles.resultCard}>
            <Typography variant="h2" style={[styles.scoreText, { color: result.passed ? COLORS.success : COLORS.error }]}>
              Score: {result.score}/25
            </Typography>
            <View style={styles.statRow}>
              <Typography variant="body">Fluency:</Typography>
              <Typography variant="keyword">{result.fluency}/10</Typography>
            </View>
            <View style={styles.statRow}>
              <Typography variant="body">Steadiness:</Typography>
              <Typography variant="keyword">{result.steadiness}/10</Typography>
            </View>
            <View style={styles.statRow}>
              <Typography variant="body">Filler Words:</Typography>
              <Typography variant="keyword">{result.fillerWords}</Typography>
            </View>
            <Typography variant="body" style={styles.resultMessage}>
              {result.passed ? "Marcie: I'll allow it." : "Marcie: Try again. Less thinking, more truth."}
            </Typography>
          </GlassCard>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { 
    padding: SPACING.screenPadding, 
    gap: SPACING.large,
    flexGrow: 1,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small,
  },
  card: { 
    padding: SPACING.large, 
    gap: SPACING.regular,
  },
  prompt: { 
    textAlign: 'center',
  },
  subPrompt: { 
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1000,
    alignSelf: 'flex-end',
  },
  recordContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 200,
  },
  recordBtn: { 
    width: 200, 
    height: 200, 
    borderRadius: BORDER_RADIUS.round,
  },
  recording: { 
    backgroundColor: COLORS.error,
  },
  resultCard: { 
    padding: SPACING.large, 
    gap: SPACING.regular, 
    alignItems: 'center',
  },
  scoreText: {
    // color is dynamic based on result.passed
  },
  statRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%',
  },
  resultMessage: {
    marginTop: SPACING.regular,
    fontStyle: 'italic',
  },
});
