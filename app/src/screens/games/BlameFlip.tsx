import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';

import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const ORIGINAL = ["You", "make", "me", "feel", "ignored"];
const GOAL = ["I", "feel", "ignored", "when", "you"]; // Simplified check

export default function BlameFlip({ navigation }: any) {
  const [words, setWords] = useState(["You", "make", "me", "feel", "ignored"]);
  const [success, setSuccess] = useState(false);

  // Simplified "drag and drop" by just swapping specific words for this demo
  // A real implementation would use a drag-and-drop library

  function swapToI() {
     setWords(["I", "feel", "ignored", "when..."]);
     setSuccess(true);
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Typography variant="body">Back</Typography>
            </SquishyButton>
            <Typography variant="h1" center>The Love Arcade</Typography>
          </View>
          
          <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

          {/* Dr. Marcie Section */}
          <GlassCard style={styles.drMarcieSection} variant="outlined">
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
            </View>
            <View style={styles.quoteBox}>
              <Typography variant="body">Transform blame into ownership! Change "you" statements to "I" statements for better communication.</Typography>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Typography variant="h2" center>Fix the Sentence</Typography>
            <Typography variant="body" center style={styles.instructionText}>
              Change "You make me feel..." to an "I" statement.
            </Typography>

            <View style={styles.wordRow}>
              {words.map((w, i) => (
                <View key={i} style={styles.wordBox}>
                  <Typography variant="body" style={styles.wordText}>{w}</Typography>
                </View>
              ))}
            </View>

            {!success ? (
              <SquishyButton onPress={swapToI} style={styles.btn}>
                <Typography variant="button" style={styles.buttonText}>Flip It</Typography>
              </SquishyButton>
            ) : (
               <View style={styles.successContainer}>
                 <Typography variant="h2" center style={styles.successText}>Nice Flip! (+10 XP)</Typography>
                 <Typography variant="body" center style={styles.feedbackText}>
                   Marcie: "'You never listen' → 'I feel unheard when…'—YES. Now say it without an eye roll."
                 </Typography>
               </View>
            )}
          </GlassCard>
        </ScrollView>

    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: { 
    padding: SPACING.regular, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
    padding: SPACING.regular,
  },
  avatarContainer: {
    width: SPACING.xxlarge + SPACING.medium,
    height: SPACING.xxlarge + SPACING.medium,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  avatar: {
    width: SPACING.xxlarge,
    height: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
  card: { 
    padding: SPACING.regular, 
    gap: SPACING.regular, 
    alignItems: 'center',
  },
  wordRow: { 
    flexDirection: 'row', 
    gap: SPACING.small, 
    flexWrap: 'wrap', 
    justifyContent: 'center' 
  },
  wordBox: { 
    padding: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  wordText: { 
    color: COLORS.textPrimary, 
    fontWeight: 'bold' 
  },
  btn: { 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center', 
    width: 200,
  },
});
