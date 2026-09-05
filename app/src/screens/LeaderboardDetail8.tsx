import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface MadLibInputProps {
  options: string[];
  color: string;
  label: string;
}

const MadLibInput = ({ options, color, label }: MadLibInputProps) => (
  <View style={styles.madLibContainer}>
    <Typography variant="body" color={color} style={styles.madLibLabel}>{label}</Typography>
  </View>
);

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <GlassCard variant="outlined" style={styles.statCard} padding="medium">
    <Typography variant="h2" center>{icon}</Typography>
    <Typography variant="label" color={COLORS.textSecondary} center style={{ marginTop: SPACING.small }}>
      {label}
    </Typography>
    <Typography variant="h4" color={COLORS.textPrimary} center style={{ marginTop: SPACING.tiny }}>
      {value}
    </Typography>
  </GlassCard>
);

const LeaderboardDetail8Screen = () => {
  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="gameTitle" color={COLORS.textPrimary} center style={styles.title}>
          STRUCTURED REFLECTION
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} center style={styles.subtitle}>
          Use these guided sentences to navigate your feelings.
        </Typography>

        <GlassCard variant="outlined" style={styles.glassPanel} padding="large">
          <View style={styles.madLibRow}>
            <Typography variant="body" color={COLORS.textPrimary}>I FELT</Typography>
            <MadLibInput label="EMOTION" color={COLORS.vibrantPink} options={['Cherished', 'Heard']}/>
            <Typography variant="body" color={COLORS.textPrimary}>WHEN YOU</Typography>
            <MadLibInput label="ACTION" color={COLORS.lavenderPurple} options={['listened', 'held my hand']}/>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="ADD ANY EXTRA THOUGHTS TO YOUR REFLECTION..."
            placeholderTextColor={COLORS.textHint}
            multiline
          />

          <SquishyButton style={styles.submitButton}>
            <Typography variant="button" color={COLORS.backgroundPrimary} center>
              SUBMIT REFLECTION
            </Typography>
          </SquishyButton>
        </GlassCard>
        
        <View style={styles.statsContainer}>
          <StatCard label="REFLECTIONS SHARED" value="24 SESSIONS" icon="📝"/>
          <StatCard label="BOND STRENGTH" value="+150 HP" icon="💪"/>
          <StatCard label="CURRENT STREAK" value="5 DAYS" icon="🔥"/>
        </View>

      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { 
    padding: SPACING.screenPadding 
  },
  title: { 
    marginBottom: SPACING.small 
  },
  subtitle: { 
    marginBottom: SPACING.xlarge, 
    maxWidth: 300, 
    alignSelf: 'center' 
  },
  glassPanel: { 
    marginBottom: SPACING.xlarge
  },
  madLibRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: SPACING.xlarge 
  },
  madLibContainer: { 
    borderBottomWidth: 2, 
    borderBottomColor: COLORS.vibrantPink, 
    margin: SPACING.small 
  },
  madLibLabel: { 
    paddingVertical: SPACING.tiny,
    fontWeight: 'bold'
  },
  textInput: { 
    backgroundColor: COLORS.backgroundPrimary, 
    borderRadius: BORDER_RADIUS.medium, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    minHeight: 100, 
    marginVertical: SPACING.regular, 
    textAlignVertical: 'top', 
    fontWeight: 'bold'
  },
  submitButton: {
    alignSelf: 'center',
  },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    gap: SPACING.small 
  },
  statCard: { 
    alignItems: 'center', 
    flex: 1 
  },
});

export default LeaderboardDetail8Screen;
