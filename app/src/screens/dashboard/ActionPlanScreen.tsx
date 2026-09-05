import { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

const CustomToggle = ({ value, onValueChange }: { value: boolean, onValueChange: (v: boolean) => void }) => {
  return (
    <SquishyButton onPress={() => onValueChange(!value)} variant="ghost" size="small">
      <View style={[styles.toggleBase, value && styles.toggleBaseActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </SquishyButton>
  );
};

export default function ActionPlanScreen({ navigation }: any) {
  const [scheduleReflection, setScheduleReflection] = useState(true);

  const onCommit = () => {
    navigation.navigate('DashboardHome');
  };

  return (
    <ScreenLayout showHeader={true}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <View>
            <View style={styles.resolutionFoundContainer}>
              <MaterialIcons name="auto-awesome" size={14} color={COLORS.vibrantPink} />
              <Typography variant="label" style={styles.resolutionFoundText}>Resolution Found</Typography>
            </View>
            <Typography variant="header" style={styles.mainTitle}>Your Action Plan</Typography>
            <Typography variant="body" style={styles.subtitle}>Concrete steps to honor your decoded connection</Typography>
          </View>
        </View>

        <View style={styles.actionCardsContainer}>
          <GlassCard style={[styles.actionCard, { borderColor: COLORS.brightYellow }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: COLORS.backgroundInput }]}>
                <MaterialCommunityIcons name="brain" size={32} color={COLORS.brightYellow} />
              </View>
              <Typography variant="label" style={{ color: COLORS.brightYellow }}>01</Typography>
            </View>
            <Typography variant="header" style={styles.cardTitle}>The Approach</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              <Typography variant="body" style={{ color: COLORS.brightYellow }}>Active Listening:</Typography> Shift your mindset to hear their needs without formulating a rebuttal.
            </Typography>
            <View style={styles.cardFooter}>
              <Typography variant="label" style={{ color: COLORS.brightYellow }}>Mindset Shift</Typography>
            </View>
          </GlassCard>

          <GlassCard style={[styles.actionCard, { borderColor: COLORS.mintGreen }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: COLORS.backgroundInput }]}>
                <MaterialIcons name="chat-bubble" size={32} color={COLORS.mintGreen} />
              </View>
              <Typography variant="label" style={{ color: COLORS.mintGreen }}>02</Typography>
            </View>
            <Typography variant="header" style={styles.cardTitle}>The Action</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              <Typography variant="body" style={{ color: COLORS.mintGreen }}>10-Minute Check-in:</Typography> Set aside focused, phone-free time tonight to discuss how you feel.
            </Typography>
            <View style={styles.cardFooter}>
              <Typography variant="label" style={{ color: COLORS.mintGreen }}>Behavioral Task</Typography>
            </View>
          </GlassCard>

          <GlassCard style={[styles.actionCard, { borderColor: COLORS.vibrantPink }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconContainer, { backgroundColor: COLORS.backgroundInput }]}>
                <MaterialIcons name="favorite" size={32} color={COLORS.vibrantPink} />
              </View>
              <Typography variant="label" style={{ color: COLORS.vibrantPink }}>03</Typography>
            </View>
            <Typography variant="header" style={styles.cardTitle}>The Maintenance</Typography>
            <Typography variant="body" style={styles.cardDescription}>
              <Typography variant="body" style={{ color: COLORS.vibrantPink }}>Gratitude:</Typography> Express one specific thing you appreciate about how they handled this talk.
            </Typography>
            <View style={styles.cardFooter}>
              <Typography variant="label" style={{ color: COLORS.vibrantPink }}>Long-term Bond</Typography>
            </View>
          </GlassCard>
        </View>

        <GlassCard style={[styles.actionPanel, scheduleReflection && {borderColor: COLORS.mintGreen}]}>
          <View style={styles.actionPanelIcon}>
            <MaterialIcons name="alarm-on" size={30} color={COLORS.mintGreen}/>
          </View>
          <View style={styles.actionPanelText}>
            <Typography variant="header" style={styles.actionPanelTitle}>Schedule Reflection</Typography>
            <Typography variant="body" style={styles.actionPanelSubtitle}>Would you like a cosmic reminder to revisit this plan in 48 hours?</Typography>
          </View>
          <CustomToggle value={scheduleReflection} onValueChange={setScheduleReflection} />
        </GlassCard>

        <View style={styles.buttonGroup}>
          <SquishyButton onPress={() => navigation.navigate('DashboardHome')} variant="secondary">
            <Typography variant="button">Back to Dashboard</Typography>
          </SquishyButton>
          <SquishyButton onPress={onCommit}>
            <MaterialIcons name="verified-user" size={20} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">Commit to Plan</Typography>
          </SquishyButton>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { 
    padding: SPACING.screenPadding 
  },
  pageHeader: {
    marginBottom: SPACING.xlarge,
  },
  resolutionFoundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    marginBottom: SPACING.small,
  },
  resolutionFoundText: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  mainTitle: { 
    marginBottom: SPACING.small,
  },
  subtitle: { 
    color: COLORS.textSecondary,
  },
  actionCardsContainer: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  actionCard: {
    padding: SPACING.xlarge,
    borderWidth: 1,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: SPACING.regular,
  },
  cardIconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: BORDER_RADIUS.medium, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardTitle: { 
    marginBottom: SPACING.small,
  },
  cardDescription: { 
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.bodyLarge * TYPOGRAPHY.lineHeight.normal,
    marginBottom: SPACING.regular,
  },
  cardFooter: { 
    marginTop: 'auto', 
    paddingTop: SPACING.regular, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.divider,
  },
  actionPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.xlarge,
  },
  actionPanelIcon: { 
    padding: SPACING.small, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  actionPanelText: { 
    flex: 1 
  },
  actionPanelTitle: { 
    marginBottom: SPACING.tiny,
  },
  actionPanelSubtitle: { 
    color: COLORS.textSecondary,
  },
  toggleBase: { 
    width: 60, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: COLORS.backgroundInput, 
    justifyContent: 'center', 
    padding: SPACING.tiny 
  },
  toggleBaseActive: { 
    backgroundColor: COLORS.mintGreen 
  },
  toggleThumb: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: COLORS.textPrimary 
  },
  toggleThumbActive: { 
    transform: [{ translateX: 28 }] 
  },
  buttonGroup: { 
    gap: SPACING.regular,
  },
});
