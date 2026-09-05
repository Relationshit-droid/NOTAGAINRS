import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { supabase, updateFight } from '../../lib/supabase';
import { analyzeFight } from '../../lib/ai-engine';
import { speakMarcie } from '../../lib/voice-engine';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type VerdictScreenProps = {
  route: any;
  navigation: any;
};

export default function VerdictScreen({ route, navigation }: VerdictScreenProps) {
  const { fightId, timeout } = route.params || {};
  const [verdict, setVerdict] = useState<{ right: string[]; callout: string[]; repairs_a: string[]; repairs_b: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fightId) {
      // simulation for testing if no fightId
      setTimeout(() => {
        setVerdict({
          right: ['You expressed feelings using "I" statements.', 'You avoided "Always/Never" absolute language.'],
          callout: ['You accused them of "ruining the night". That is an interpretation, not a fact.', 'Story-telling: "You don\'t care" is a mind-read.'],
          repairs_a: ['"I might be overreacting..."', '"Can we start over?"'],
          repairs_b: ['"I hear you."', '"I am listening."']
        });
        setLoading(false);
      }, 2000);
      return;
    }

    supabase.from('fights').select('*').eq('id', fightId).single().then(async ({ data, error }: any) => {
      if (error || !data) { setLoading(false); return; }

      const couple_id = data.couple_id;
      const profiles = await supabase.from('profiles').select('*').eq('couple_code', couple_id);

      const a = data.partner_a_input || '{}';
      const b = data.partner_b_input || '{}';

      // We would use profile data for better AI context
      const origin_story = profiles.data?.[0]?.origin_story || '';
      const first_red_flag = profiles.data?.[0]?.first_red_flag || '';

      const analysis = await analyzeFight({
        origin_story,
        first_red_flag,
        partner_a_input: a,
        partner_b_input: b,
        personality: 'balanced',
        sarcasm_level: 1
      });

      setVerdict(analysis);
      await updateFight(fightId, { ai_analysis: JSON.stringify(analysis), completion_status: timeout ? 'timeout' : 'completed' });
      setLoading(false);

      if (analysis.callout.length > 0) {
        speakMarcie(analysis.callout[0]);
      }
    });
  }, [fightId, timeout]);

  if (loading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Analyzing the conflict patterns...">
        <SafeAreaView style={styles.container}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.vibrantPink} style={styles.loader} />
            <Typography variant="h2" style={styles.loadingTitle}>Analyzing Conflict...</Typography>
            <Typography variant="body" style={styles.loadingSub}>Consulting the emotional database.</Typography>
          </View>
        </SafeAreaView>
      </ScreenLayout>
    );
  }

  if (!verdict) return (
    <ScreenLayout showMarcie={true} marcieQuote="Something went wrong. Let's try again.">
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Typography variant="h2" style={styles.errorTitle}>Error loading verdict.</Typography>
          <SquishyButton onPress={() => navigation.goBack()} variant="primary">
            Go Back
          </SquishyButton>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Here's what I observed. Remember, growth comes from awareness.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>The Verdict</Typography>
            <Typography variant="body" style={styles.sub}>Dr. Marcie has thoughts.</Typography>
          </View>

          {/* What You Did Right */}
          <GlassCard style={[styles.card, { borderColor: COLORS.success }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.success}20` }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.success }}>What You Did Right</Typography>
            </View>
            {verdict.right.map((r, i) => (
              <View key={i} style={styles.bullet}>
                <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
                <Typography variant="body" style={styles.bulletText}>{r}</Typography>
              </View>
            ))}
          </GlassCard>

          {/* The Call-Out */}
          <GlassCard style={[styles.card, { borderColor: COLORS.error }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.error}20` }]}>
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              </View>
              <Typography variant="h3" style={{ color: COLORS.error }}>The Call-Out</Typography>
            </View>
            {verdict.callout.map((r, i) => (
              <View key={i} style={styles.bullet}>
                <View style={[styles.dot, { backgroundColor: COLORS.error }]} />
                <Typography variant="body" style={[styles.bulletText, styles.calloutText]}>{r}</Typography>
              </View>
            ))}
          </GlassCard>

          <Typography variant="label" style={styles.repairsTitle}>
            REPAIR ATTEMPTS DETECTED
          </Typography>

          <View style={styles.repairsContainer}>
            <GlassCard style={styles.repairCard}>
              <Typography variant="h4" style={styles.repairCardTitle}>You</Typography>
              {verdict.repairs_a.length > 0 ? verdict.repairs_a.map((r, i) => (
                <Typography key={i} variant="body" style={styles.repairItem}>• "{r}"</Typography>
              )) : <Typography variant="body" style={styles.noRepairs}>No repairs detected.</Typography>}
            </GlassCard>

            <GlassCard style={styles.repairCard}>
              <Typography variant="h4" style={styles.repairCardTitle}>Partner</Typography>
              {verdict.repairs_b.length > 0 ? verdict.repairs_b.map((r, i) => (
                <Typography key={i} variant="body" style={styles.repairItem}>• "{r}"</Typography>
              )) : <Typography variant="body" style={styles.noRepairs}>No repairs detected.</Typography>}
            </GlassCard>
          </View>

          <SquishyButton 
            onPress={() => navigation.popToTop()} 
            variant="primary"
            size="large"
            style={styles.acceptBtn}
          >
            Accept & Close
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  loader: {
    marginBottom: SPACING.lg,
  },
  loadingTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  loadingSub: {
    opacity: 0.6,
    textAlign: 'center',
  },
  errorTitle: {
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  scroll: { 
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: SPACING.lg,
  },
  title: { 
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  sub: { 
    opacity: 0.5,
    textAlign: 'center',
  },
  card: { 
    marginBottom: SPACING.lg,
    borderWidth: 1,
    padding: SPACING.lg,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.md, 
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.textPrimary}10`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullet: { 
    flexDirection: 'row', 
    gap: SPACING.md, 
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    lineHeight: 22,
  },
  calloutText: {
    color: COLORS.error,
    opacity: 0.9,
  },
  repairsTitle: { 
    marginTop: SPACING.md, 
    marginBottom: SPACING.md, 
    textAlign: 'center',
    letterSpacing: 1,
  },
  repairsContainer: { 
    flexDirection: 'column',
    gap: SPACING.md,
  },
  repairCard: { 
    flex: 1,
    padding: SPACING.lg,
  },
  repairCardTitle: {
    marginBottom: SPACING.sm,
    opacity: 0.8,
  },
  repairItem: {
    marginBottom: SPACING.xs,
  },
  noRepairs: {
    opacity: 0.5,
  },
  acceptBtn: { 
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
});
