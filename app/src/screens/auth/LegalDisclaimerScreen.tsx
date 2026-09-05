import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import * as Haptics from '../../utils/haptics';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

type Props = {
  onContinue: () => void;
};

export default function LegalDisclaimerScreen({ onContinue }: Props) {
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onContinue();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <View style={styles.header}>
        <Image source={require('../../../assets/logo/mainlogoone.png')} style={styles.logo} resizeMode="contain" />
        <Typography variant="header">RELATIONSHIT!</Typography>
      </View>

      <View style={styles.contentContainer}>
        <GlassCard style={styles.card} variant="elevated">
          <View style={styles.heroSection}>
            <Typography variant="header" style={styles.heroTitle}>Welcome, Seekers</Typography>
          </View>

          <View style={styles.disclaimerSection}>
            <View style={styles.iconRow}>
              <Ionicons name="document-text" size={24} color={COLORS.vibrantPink} />
              <Typography variant="label" style={styles.disclaimerLabel}>LEGAL DISCLAIMER</Typography>
            </View>
            <ScrollView style={styles.scrollArea} persistentScrollbar showsVerticalScrollIndicator={true}>
              <Typography variant="body" style={styles.disclaimerText}>
                This game, RELATIONSHIT!, is designed exclusively for entertainment and connection purposes between consenting adults. It provides a structured framework for dialogue and shared experiences.{'\n\n'}
                Important: This experience is NOT a replacement for professional clinical therapy, medical advice, psychological diagnosis, or mental health counseling. If you or your partner are experiencing significant distress or require clinical intervention, please consult a licensed professional.{'\n\n'}
                By proceeding, you acknowledge that you are participating voluntarily and that the creators of this game are not liable for any interpersonal outcomes or emotional responses triggered during gameplay.
              </Typography>
            </ScrollView>
          </View>

          <View style={styles.footerSection}>
            <SquishyButton
              onPress={() => {
                Haptics.selectionAsync();
                setAgreed(!agreed);
              }}
              variant="secondary"
            >
              <View style={styles.checkboxRow}>
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={16} color={COLORS.textPrimary} />}
                </View>
                <Typography variant="body">I understand and agree to the terms</Typography>
              </View>
            </SquishyButton>

            <SquishyButton onPress={handleContinue} disabled={!agreed}>
              <Typography variant="button">Continue Journey</Typography>
              <Ionicons name="arrow-forward" size={20} color={COLORS.textPrimary} style={{ marginLeft: SPACING.small }} />
            </SquishyButton>
          </View>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { 
    alignItems: 'center', 
    marginTop: SPACING.regular, 
    marginBottom: SPACING.regular 
  },
  logo: { 
    width: 60, 
    height: 60 
  },
  contentContainer: { 
    flex: 1, 
    paddingHorizontal: SPACING.screenPadding, 
    justifyContent: 'center', 
    paddingBottom: SPACING.xlarge 
  },
  card: { 
    padding: 0, 
    borderRadius: BORDER_RADIUS.xxlarge, 
    overflow: 'hidden', 
    maxHeight: '80%' 
  },
  heroSection: { 
    padding: SPACING.xlarge, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.divider 
  },
  heroTitle: { 
    color: COLORS.vibrantPink 
  },
  disclaimerSection: { 
    padding: SPACING.xlarge, 
    flex: 1 
  },
  iconRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.regular, 
    gap: SPACING.small 
  },
  disclaimerLabel: { 
    color: COLORS.vibrantPink, 
    letterSpacing: 1 
  },
  scrollArea: { 
    flex: 1 
  },
  disclaimerText: { 
    color: COLORS.textSecondary, 
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium 
  },
  footerSection: { 
    padding: SPACING.xlarge, 
    paddingTop: SPACING.regular, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.divider, 
    gap: SPACING.regular 
  },
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: BORDER_RADIUS.small, 
    borderWidth: 2, 
    borderColor: COLORS.borderSubtle, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  checkboxChecked: { 
    backgroundColor: COLORS.lavenderPurple, 
    borderColor: COLORS.lavenderPurple 
  },
});
