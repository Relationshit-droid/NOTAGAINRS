import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import ResultsScreen from '../../components/games/engine/ResultsScreen';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function ResultsRoastScreen({ route, navigation }: any) {
  const { result, verdict } = route.params || {};
  const [done, setDone] = useState(false);
  
  useEffect(() => { 
    if (verdict?.callout) speakMarcie(verdict.callout.join(' ')); 
  }, [verdict]);
  
  if (!result) return (
    <ScreenLayout showHeader={false}>
      <View style={styles.centerContent}>
        <Typography variant="h2">No results</Typography>
      </View>
    </ScreenLayout>
  );
  
  return (
    <ScreenLayout showHeader={false}>
      <View style={styles.root}>
        <ResultsScreen result={result} onDone={() => setDone(true)} />
        {verdict && (
          <>
            <GlassCard>
              <Typography variant="h2" style={styles.sectionTitle}>What You Did Right</Typography>
              {verdict.right?.map((r: string, i: number) => (
                <Typography key={i} variant="body" style={styles.listItem}>{r}</Typography>
              ))}
            </GlassCard>
            <GlassCard>
              <Typography variant="h2" style={styles.sectionTitle}>The Call-Out</Typography>
              {verdict.callout?.map((r: string, i: number) => (
                <Typography key={i} variant="sass" style={styles.listItem}>{r}</Typography>
              ))}
            </GlassCard>
            <View style={styles.actions}>
              <SquishyButton 
                onPress={() => navigation.goBack()} 
                variant="primary"
                size="medium"
                style={styles.btn}
              >
                <Typography variant="button">Back to Home</Typography>
              </SquishyButton>
            </View>
          </>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: { 
    flex: 1, 
    padding: SPACING.screenPadding, 
    gap: SPACING.regular,
  },
  sectionTitle: {
    marginBottom: SPACING.regular,
  },
  listItem: {
    marginBottom: SPACING.small,
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    marginTop: SPACING.regular,
  },
  btn: { 
    paddingHorizontal: SPACING.xlarge, 
    paddingVertical: SPACING.regular,
  },
});
