import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const ResentmentTag = ({ text, onRelease, index }: { text: string, onRelease: () => void, index: number }) => {
  const colors = [COLORS.vibrantPink, COLORS.lavenderPurple, COLORS.info, COLORS.warmOrange, COLORS.success];
  const color = colors[index % colors.length];
  
  return (
    <SquishyButton 
      style={[styles.resentmentTag, { borderColor: `${color}50`, backgroundColor: `${color}15` }]}
      onPress={onRelease}
      variant="ghost"
    >
      <Typography variant="body" style={[styles.resentmentTagText, { color }]}>
        {text}
      </Typography>
      <Ionicons name="flame" size={16} color={color} />
    </SquishyButton>
  );
};

const ApologyAndReleaseWorkshopScreen = () => {
  const [letterText, setLetterText] = useState('');
  const [resentments, setResentments] = useState([
    'Broken Trust',
    'That argument on Friday',
    'Feeling Ignored',
    'Unspoken Expectations',
    'Past Hurt',
  ]);
  const [released, setReleased] = useState<string[]>([]);

  const handleRelease = (index: number) => {
    const releasedItem = resentments[index];
    setReleased([...released, releasedItem]);
    const newResentments = [...resentments];
    newResentments.splice(index, 1);
    setResentments(newResentments);
  };

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Letting go is an act of love—for yourself and your relationship.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.mainTitle}>
              Apology & Release Workshop
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Burning the Past to Build the Future
            </Typography>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(released.length / (resentments.length + released.length)) * 100}%` }
                ]} 
              />
            </View>
            <Typography variant="small" style={styles.progressText}>
              {released.length} of {resentments.length + released.length} released
            </Typography>
          </View>

          {/* The Apology Letter Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.vibrantPink} />
              <Typography variant="h2" style={styles.sectionTitle}>The Apology Letter</Typography>
            </View>
            <GlassCard style={styles.letterCard}>
              <TextInput
                placeholder="I apologize for... I understand this hurt you because... In the future, I will..."
                placeholderTextColor={COLORS.textHint}
                value={letterText}
                onChangeText={setLetterText}
                multiline
                numberOfLines={8}
                style={styles.letterInput}
              />
              <View style={styles.letterTips}>
                <Typography variant="small" style={styles.tipText}>
                  💡 Tip: Be specific about what you're apologizing for and how you'll change.
                </Typography>
              </View>
            </GlassCard>
          </View>

          {/* The Release Flame Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flame" size={24} color={COLORS.warmOrange} />
              <Typography variant="h2" style={styles.sectionTitle}>The Release Flame</Typography>
            </View>
            <Typography variant="body" style={styles.sectionDescription}>
              Tap on each resentment to release it into the flame. Let go of what no longer serves your relationship.
            </Typography>
            
            <GlassCard style={styles.flameContainer}>
              {/* Flame Animation Placeholder */}
              <View style={styles.flameVisual}>
                <Ionicons name="flame" size={64} color={COLORS.warmOrange} />
                <Typography variant="h3" style={styles.flameText}>Release</Typography>
              </View>
              
              {resentments.length > 0 ? (
                <View style={styles.resentmentsList}>
                  {resentments.map((text, index) => (
                    <ResentmentTag 
                      key={index} 
                      text={text} 
                      index={index}
                      onRelease={() => handleRelease(index)} 
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.allReleased}>
                  <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
                  <Typography variant="h3" style={styles.allReleasedText}>
                    All Released!
                  </Typography>
                  <Typography variant="body" style={styles.allReleasedSub}>
                    You've let go of the past. Time to build the future.
                  </Typography>
                </View>
              )}
            </GlassCard>
          </View>

          {/* Released Items Section */}
          {released.length > 0 && (
            <View style={styles.section}>
              <Typography variant="h3" style={styles.releasedTitle}>Released</Typography>
              <View style={styles.releasedList}>
                {released.map((item, index) => (
                  <View key={index} style={styles.releasedItem}>
                    <Ionicons name="checkmark" size={16} color={COLORS.success} />
                    <Typography variant="body" style={styles.releasedItemText}>{item}</Typography>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <SquishyButton
              onPress={() => {}}
              variant="primary"
              size="large"
            >
              Save Letter
            </SquishyButton>
            <SquishyButton
              onPress={() => {}}
              variant="secondary"
              size="large"
            >
              Share with Partner
            </SquishyButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.vibrantPink,
    opacity: 0.8,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: `${COLORS.richPlum}80`,
    borderRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.vibrantPink,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  progressText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  sectionDescription: {
    opacity: 0.7,
    marginBottom: SPACING.md,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
  },
  letterCard: {
    padding: 0,
    overflow: 'hidden',
  },
  letterInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    borderWidth: 0,
    backgroundColor: COLORS.backgroundInput,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  letterTips: {
    padding: SPACING.md,
    backgroundColor: `${COLORS.info}10`,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tipText: {
    color: COLORS.info,
  },
  flameContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  flameVisual: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  flameText: {
    color: COLORS.warmOrange,
    marginTop: SPACING.sm,
  },
  resentmentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  resentmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
  },
  resentmentTagText: {
    fontWeight: '500',
  },
  allReleased: {
    alignItems: 'center',
  },
  allReleasedText: {
    color: COLORS.success,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  allReleasedSub: {
    opacity: 0.7,
    textAlign: 'center',
  },
  releasedTitle: {
    marginBottom: SPACING.md,
    opacity: 0.8,
  },
  releasedList: {
    gap: SPACING.sm,
  },
  releasedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  releasedItemText: {
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});

export default ApologyAndReleaseWorkshopScreen;
