import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, COMPONENTS } from '../../theme';

const RISKY_TEXT = "Fine. Do whatever you want.";

export default function TextToneTranslator({ route, navigation }: any) {
  const { gameId } = route.params;
  const [rewrite, setRewrite] = useState('');

  function check() {
    if (rewrite.toLowerCase().includes('fine')) {
      speakMarcie("You used the word 'fine' again. Are you trying to start a war?");
      HapticFeedbackSystem.error();
    } else {
      speakMarcie("Much better. Less passive, more aggressive... wait, no, just assertive.");
      HapticFeedbackSystem.success();
      Alert.alert("Translated", "Sent to partner for approval.", [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          <Typography variant="h2">Risk Detected</Typography>
          <Typography variant="sass" style={styles.risk}>"{RISKY_TEXT}"</Typography>
          <Typography variant="body">Rewrite this to be safer:</Typography>
          <TextInput
            style={styles.input}
            placeholder="I feel frustrated because..."
            placeholderTextColor={COLORS.textHint}
            value={rewrite}
            onChangeText={setRewrite}
            multiline
          />
          <SquishyButton onPress={check} style={styles.btn}>
            <Typography variant="h2">Translate</Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  risk: { 
    marginVertical: SPACING.regular, 
    textAlign: 'center',
    color: COLORS.emotionalConnection,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.input, 
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    textAlignVertical: 'top',
  },
  btn: { 
    marginTop: SPACING.regular 
  },
});
