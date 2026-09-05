import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const PlanItem = ({ text, completed, urgent }: { text: string, completed?: boolean, urgent?: boolean }) => (
  <View style={styles.planItem}>
    <View style={styles.planItemLeft}>
      <View style={[styles.checkbox, completed && styles.completedCheckbox]}>
        {completed && <Ionicons name="checkmark" size={16} color={COLORS.deepCosmic} />}
      </View>
      <Typography variant="body" style={styles.planText}>{text}</Typography>
    </View>
    {urgent && (
      <View style={styles.urgentTag}>
        <Typography variant="small" style={styles.urgentTagText}>Urgent</Typography>
      </View>
    )}
  </View>
);

const VibeTag = ({ text, color }: { text: string, color: string }) => (
  <View style={[styles.vibeTag, { backgroundColor: `${color}30`, borderColor: `${color}50` }]}>
    <Typography variant="small" style={[styles.vibeTagText, { color }]}>{text}</Typography>
  </View>
);

const DateDetailsPlanningScreen = () => {
  const menuItems = [
    { label: 'Plan Logistics', active: true },
    { label: 'Mood Board', active: false },
    { label: 'Preparation', active: false },
    { label: 'Memories', active: false },
  ];

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Planning the perfect date shows how much you care.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.headerTitle}>Date Details</Typography>
            <Typography variant="body" style={styles.headerSubtitle}>
              Activity: Starlit Dinner & Deep Dive
            </Typography>
          </View>

          {/* Mobile Menu */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuScroll}
          >
            {menuItems.map((item, index) => (
              <SquishyButton 
                key={index}
                variant={item.active ? 'primary' : 'ghost'}
                style={[styles.menuItem, item.active && styles.activeMenuItem]}
                onPress={() => {}}
              >
                <Typography 
                  variant="body" 
                  style={[styles.menuText, item.active && styles.activeMenuText]}
                >
                  {item.label}
                </Typography>
              </SquishyButton>
            ))}
          </ScrollView>

          {/* Logistics Section */}
          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>The Plan (Logistics)</Typography>
            <View style={styles.logisticsContainer}>
              <GlassCard style={[styles.logisticsCard, { borderLeftColor: COLORS.warning }]}>
                <Ionicons name="time-outline" size={24} color={COLORS.warning} />
                <Typography variant="h4" style={styles.logisticsTitle}>Time & Duration</Typography>
                <Typography variant="body" style={styles.logisticsText}>7:00 PM • 3 Hours</Typography>
              </GlassCard>
              <GlassCard style={[styles.logisticsCard, { borderLeftColor: COLORS.warmOrange }]}>
                <Ionicons name="location-outline" size={24} color={COLORS.warmOrange} />
                <Typography variant="h4" style={styles.logisticsTitle}>Location</Typography>
                <Typography variant="body" style={styles.logisticsText}>Celestial Rooftop Lounge</Typography>
              </GlassCard>
              <GlassCard style={[styles.logisticsCard, { borderLeftColor: COLORS.lavenderPurple }]}>
                <Ionicons name="shirt-outline" size={24} color={COLORS.lavenderPurple} />
                <Typography variant="h4" style={styles.logisticsTitle}>Dress Code</Typography>
                <Typography variant="body" style={styles.logisticsText}>Smart Casual / Cosmic Chic</Typography>
              </GlassCard>
            </View>
          </View>

          {/* Preparation Section */}
          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>Preparation Tasks</Typography>
            <GlassCard>
              <PlanItem text="Confirm table reservation for two" completed />
              <PlanItem text="Download 'Deep Dive' question pack" completed />
              <PlanItem text="Order surprise floral arrangement" urgent />
              <PlanItem text="Charge Polaroid camera & check film" />
            </GlassCard>
          </View>

          {/* Vibe & Notes Section */}
          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>The Vibe</Typography>
            <GlassCard style={styles.vibeContainer}>
              <VibeTag text="Intimate" color={COLORS.rosePink} />
              <VibeTag text="Conversational" color={COLORS.lavenderPurple} />
              <VibeTag text="Mystical" color={COLORS.info} />
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>Special Touches</Typography>
            <GlassCard>
              <Typography variant="body" style={styles.notesText}>
                "Remember to mention the dream we talked about last Tuesday..."
              </Typography>
            </GlassCard>
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
  headerTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    color: COLORS.vibrantPink,
    textAlign: 'center',
  },
  menuScroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  menuItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: `${COLORS.richPlum}80`,
    marginRight: SPACING.sm,
  },
  activeMenuItem: {
    backgroundColor: `${COLORS.vibrantPink}20`,
    borderWidth: 1,
    borderColor: `${COLORS.vibrantPink}40`,
  },
  menuText: {
    color: COLORS.textSecondary,
  },
  activeMenuText: {
    color: COLORS.vibrantPink,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  logisticsContainer: {
    gap: SPACING.md,
  },
  logisticsCard: {
    borderLeftWidth: 4,
    gap: SPACING.xs,
    padding: SPACING.lg,
  },
  logisticsTitle: {
    marginTop: SPACING.xs,
  },
  logisticsText: {
    opacity: 0.7,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  planItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 2,
    borderColor: `${COLORS.textPrimary}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckbox: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  planText: {
    flex: 1,
  },
  urgentTag: {
    backgroundColor: `${COLORS.vibrantPink}20`,
    borderColor: `${COLORS.vibrantPink}30`,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  urgentTagText: {
    color: COLORS.vibrantPink,
    fontWeight: 'bold',
  },
  vibeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
  vibeTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  vibeTagText: {
    fontWeight: '500',
  },
  notesText: {
    fontStyle: 'italic',
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.bodyMedium,
    opacity: 0.8,
  },
});

export default DateDetailsPlanningScreen;
