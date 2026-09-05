import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const DeEscalationLabScreen = () => {
  const detectionLogs = [
    '"You always do this..."',
    '"I\'m feeling unheard..."',
  ];

  return (
    <ScreenLayout showMarcie={true} marcieQuote="Let's lower the boiling point, darling.">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.mainTitle}>
              The De-Escalation Lab
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Heated Interaction Analysis
            </Typography>
          </View>

          {/* Gauge Section */}
          <GlassCard style={styles.gaugeContainer}>
            <Typography variant="label" style={styles.gaugeLabel}>
              Current Boiling Point
            </Typography>
            <View style={styles.gaugeCircle}>
              <View style={styles.gaugeInner}>
                <Typography variant="h2" style={styles.gaugeText}>Cooling</Typography>
              </View>
            </View>
            <Typography variant="small" style={styles.gaugeSubtext}>
              Take a deep breath together
            </Typography>
          </GlassCard>

          {/* Detection Log Section */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              Detection Log
            </Typography>
            <GlassCard>
              {detectionLogs.map((log, index) => (
                <View key={index} style={styles.logItem}>
                  <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
                  <Typography variant="body" style={styles.logItemText}>{log}</Typography>
                </View>
              ))}
            </GlassCard>
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>
              De-escalation Tips
            </Typography>
            <GlassCard style={styles.tipsCard}>
              <View style={styles.tipItem}>
                <Ionicons name="pause-circle-outline" size={24} color={COLORS.success} />
                <Typography variant="body" style={styles.tipText}>
                  Take a 20-minute break when emotions run high
                </Typography>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="ear-outline" size={24} color={COLORS.info} />
                <Typography variant="body" style={styles.tipText}>
                  Practice active listening without interrupting
                </Typography>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="heart-outline" size={24} color={COLORS.vibrantPink} />
                <Typography variant="body" style={styles.tipText}>
                  Remember you're on the same team
                </Typography>
              </View>
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
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  gaugeLabel: {
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gaugeCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: COLORS.vibrantPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${COLORS.vibrantPink}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    color: COLORS.vibrantPink,
  },
  gaugeSubtext: {
    marginTop: SPACING.md,
    opacity: 0.6,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.textPrimary}10`,
  },
  logItemText: {
    flex: 1,
  },
  tipsCard: {
    gap: SPACING.md,
    padding: SPACING.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  tipText: {
    flex: 1,
    lineHeight: 22,
  },
});

export default DeEscalationLabScreen;
