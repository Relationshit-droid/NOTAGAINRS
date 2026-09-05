import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function TheIcebergDive({ navigation }: any) {
  useEffect(() => {
    speakMarcie("You got to 'I need to feel chosen'? Honey… grab tissues. And chocolate.");
  }, []);

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <View style={styles.container}>
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} variant="ghost" size="small">
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h2" style={styles.title}>The Iceberg Dive</Typography>
        </View>

        <GlassCard>
          <Typography variant="body" style={styles.typeText}>Type: Nested dropdown</Typography>
          <Typography variant="body">Mechanics: Surface ("I'm annoyed") → drill down → "Fear of invisibility" → unlock "Core Need" badge.</Typography>
        </GlassCard>

        <GlassCard>
          <Typography variant="body" style={styles.scoringTitle}>Scoring</Typography>
          <Typography variant="body">
            Reached core = +25{'\n'}
            Shared with partner = +10
          </Typography>
        </GlassCard>

        <View style={styles.actionArea}>
          <SquishyButton onPress={() => alert('Starting Dive...')} style={styles.playBtn}>
            <Typography variant="h2">Start Dive</Typography>
          </SquishyButton>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
  },
  title: { 
    flex: 1,
  },
  typeText: {
    marginBottom: SPACING.regular,
  },
  scoringTitle: {
    marginBottom: SPACING.regular,
  },
  actionArea: { 
    marginTop: SPACING.xlarge, 
    alignItems: 'center' 
  },
  playBtn: { 
    width: '80%',
  },
});
