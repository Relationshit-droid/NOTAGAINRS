import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, COMPONENTS } from '../../theme';

export default function SoundtrackSync({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [song, setSong] = useState('');

  function submit() {
    if (!song) {
      speakMarcie("Silence isn't a soundtrack. Pick a song.");
      return;
    }
    const mood = song.toLowerCase().includes('love') ? 'Romantic' : 'Edgy';
    speakMarcie(`"${song}"? Giving me ${mood} vibes. Let's see if they match.`);
    HapticFeedbackSystem.success();
    Alert.alert("Track Queued", "Waiting for partner's pick.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          <Typography variant="h2">Soundtrack of Us</Typography>
          <Typography variant="body">Pick a song that defines your relationship this week.</Typography>
          <TextInput
            style={styles.input}
            placeholder="Song Title - Artist"
            placeholderTextColor={COLORS.textHint}
            value={song}
            onChangeText={setSong}
          />
          <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Sync Track</Typography>
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
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.input, 
    marginTop: SPACING.regular,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    height: COMPONENTS.input.height,
  },
  btn: { 
    marginTop: SPACING.regular 
  },
});
