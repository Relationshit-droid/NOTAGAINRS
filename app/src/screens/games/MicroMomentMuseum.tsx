import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

export default function MicroMomentMuseum({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [caption, setCaption] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  function upload() {
    setHasPhoto(true);
    speakMarcie("Photo received. Tiny but mighty.");
    HapticFeedbackSystem.selection();
  }

  function submit() {
    if (!hasPhoto) {
      speakMarcie("Where's the photo? The exhibit is empty.");
      return;
    }
    if (!caption) {
      speakMarcie("It needs a title. Don't be lazy.");
      return;
    }
    speakMarcie(`"${caption}" — A masterpiece of mundane affection.`);
    HapticFeedbackSystem.success();
    Alert.alert("Exhibit Curated", "Added to the museum.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputAreaContainer}>
      <GlassCard>
        <Typography variant="h2">Curate a Moment</Typography>
        <Typography variant="body">Upload a photo of a small connection:</Typography>
        <SquishyButton onPress={upload} style={styles.upload} variant="ghost">
            <Typography variant="body">{hasPhoto ? "📸 Photo Selected" : "Tap to Upload Photo"}</Typography>
        </SquishyButton>
        <Typography variant="body" style={styles.captionLabel}>Write a caption:</Typography>
        <TextInput
          style={styles.input}
          placeholder="Title this moment..."
          placeholderTextColor={COLORS.textHint}
          value={caption}
          onChangeText={setCaption}
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Hang in Museum</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Micro-Moment Museum',
    description: 'Catalog small acts of love',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputAreaContainer: {
    gap: SPACING.regular,
  },
  upload: { 
    height: 100, 
    marginTop: SPACING.regular,
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle,
  },
  captionLabel: {
    marginTop: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: { 
    marginTop: SPACING.regular,
  },
});
