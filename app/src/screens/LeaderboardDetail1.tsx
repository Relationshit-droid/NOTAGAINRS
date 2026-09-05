import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import ScreenLayout from '../layout/ScreenLayout';

interface XPDisplayProps {
  label: string;
  value: string;
  color: string;
  icon: string;
}

const XPDisplay = ({ label, value, color, icon }: XPDisplayProps) => (
  <GlassCard variant="outlined" style={styles.xpBox} padding="small">
    <Typography variant="h3" center>{icon}</Typography>
    <View>
      <Typography variant="label" color={COLORS.textSecondary} center>{label}</Typography>
      <Typography variant="body" color={color} center style={{ marginTop: SPACING.tiny }}>{value}</Typography>
    </View>
  </GlassCard>
);

const PostRepairScreen = () => {
  const rating = 4;

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <LinearGradient
        colors={[COLORS.deepCosmic, COLORS.richPlum]}
        style={styles.background}
      />

      <View style={styles.mainContent}>
        <GlassCard style={styles.glassPanel} padding="large">
          <Typography variant="label" color={COLORS.textSecondary} center>
            REPAIR SESSION COMPLETE
          </Typography>
          <Typography variant="h1" color={COLORS.textPrimary} center style={styles.mainHeader}>
            DO YOU FEEL BETTER?
          </Typography>
          <Typography variant="body" color={COLORS.textSecondary} center style={styles.description}>
            Take a moment to reflect on your progress together.
          </Typography>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Typography 
                key={i} 
                variant="h1" 
                color={i <= rating ? COLORS.brightYellow : COLORS.textDisabled}
                center
                style={i <= rating ? styles.filledStar : {}}
              >
                ★
              </Typography>
            ))}
          </View>

          <SquishyButton style={styles.finishButton}>
            <Typography variant="button" color={COLORS.textPrimary} center>
              FINISH SESSION
            </Typography>
          </SquishyButton>
          
          <SquishyButton variant="ghost" style={styles.noteButton}>
            <Typography variant="label" color={COLORS.textSecondary} center>
              ADD A PRIVATE NOTE
            </Typography>
          </SquishyButton>
        </GlassCard>

        <View style={styles.xpContainer}>
          <XPDisplay label="CONNECTION" value="+250 XP" color={COLORS.brightYellow} icon="🤝"/>
          <XPDisplay label="INSIGHT" value="+120 XP" color={COLORS.info} icon="💡"/>
          <XPDisplay label="HARMONY" value="LEVEL UP!" color={COLORS.vibrantPink} icon="🎶"/>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject },
  mainContent: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: SPACING.screenPadding 
  },
  glassPanel: {
    alignItems: 'center',
  },
  mainHeader: { 
    marginTop: SPACING.regular,
    marginBottom: SPACING.small 
  },
  description: { 
    marginBottom: SPACING.xlarge 
  },
  ratingContainer: { 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    marginBottom: SPACING.xlarge 
  },
  filledStar: { 
    textShadowColor: COLORS.brightYellow, 
    textShadowRadius: SPACING.small 
  },
  finishButton: {
    width: '100%',
    marginBottom: SPACING.regular,
  },
  noteButton: {
    marginTop: SPACING.regular,
  },
  xpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: SPACING.xlarge, 
    gap: SPACING.regular 
  },
  xpBox: {
    flex: 1,
    alignItems: 'center',
  },
});

export default PostRepairScreen;
