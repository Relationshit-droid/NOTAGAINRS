import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

type SOSRepairSelectionProps = {
  navigation: any;
  route: any;
};

interface RepairStep {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  icon: string;
  color: string;
}

export default function SOSRepairSelection({ navigation, route }: SOSRepairSelectionProps) {
  const { sessionId, coupleId, repairSteps } = route.params || {};
  const [selectedRepair, setSelectedRepair] = useState<string | null>(null);
  const [showMarcie, setShowMarcie] = useState(true);
  const [marcieQuote, setMarcieQuote] = useState("Pick your poison. Er, cure. Pick your cure.");

  // Default repair options if none provided
  const defaultRepairs: RepairStep[] = [
    {
      id: 'appreciations',
      title: 'Three Appreciations',
      description: 'Each partner shares 3 specific things they appreciate about the other',
      duration: 5,
      icon: 'heart',
      color: COLORS.vibrantPink,
    },
    {
      id: 'physical_touch',
      title: 'Two-Minute Touch',
      description: 'Hold hands, hug, or maintain physical contact for 2 minutes without talking',
      duration: 2,
      icon: 'hand-left',
      color: COLORS.mintGreen,
    },
    {
      id: 'do_over',
      title: 'Do-Over Conversation',
      description: 'Re-do the triggering conversation using "I feel" statements only',
      duration: 10,
      icon: 'refresh',
      color: COLORS.brightYellow,
    },
    {
      id: 'gratitude_walk',
      title: 'Gratitude Walk',
      description: 'Walk together (or pace the room) naming things you\'re grateful for',
      duration: 5,
      icon: 'walk',
      color: COLORS.aquaTeal,
    },
  ];

  const repairs = repairSteps?.map((step: string, index: number) => ({
    id: `repair_${index}`,
    title: step,
    description: 'Tap to select this repair attempt',
    duration: 5,
    icon: defaultRepairs[index % defaultRepairs.length].icon,
    color: defaultRepairs[index % defaultRepairs.length].color,
  })) || defaultRepairs;

  const handleSelectRepair = (repairId: string) => {
    setSelectedRepair(repairId);
    const repair = repairs.find(r => r.id === repairId);
    if (repair) {
      setMarcieQuote(`"${repair.title}" — solid choice. Now do the work.`);
    }
  };

  const handleExecuteRepair = () => {
    if (!selectedRepair) {
      Alert.alert('Select a Repair', 'Choose one repair attempt to proceed');
      return;
    }
    
    const repair = repairs.find(r => r.id === selectedRepair);
    navigation.navigate('SOSRepairExecution', { 
      sessionId, 
      coupleId, 
      repair,
      repairId: selectedRepair 
    });
  };

  return (
    <ScreenLayout 
      showHeader={false} 
      scrollable={true}
      showMarcie={showMarcie}
      marcieQuote={marcieQuote}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>REPAIR ATTEMPT</Typography>
            <Typography variant="body" style={styles.subtitle}>Choose how you\'ll fix this</Typography>
          </View>

          {/* Instruction */}
          <GlassCard style={styles.instructionCard} padding="large">
            <View style={styles.instructionRow}>
              <View style={[styles.instructionIcon, { backgroundColor: `${COLORS.vibrantPink}20` }]}>
                <Ionicons name="construct" size={28} color={COLORS.vibrantPink} />
              </View>
              <View style={styles.instructionTextContainer}>
                <Typography variant="label" style={styles.instructionTitle}>RULES OF REPAIR</Typography>
                <Typography variant="caption" style={styles.instructionText}>
                  1. Both partners must agree on the same repair\n2. Set a timer. Do it fully. No half-measures.\n3. Report back here when done.
                </Typography>
              </View>
            </View>
          </GlassCard>

          {/* Repair Options */}
          <Typography variant="label" style={styles.sectionTitle}>AVAILABLE REPAIRS</Typography>
          
          <View style={styles.repairsList}>
            {repairs.map((repair) => (
              <TouchableOpacity
                key={repair.id}
                onPress={() => handleSelectRepair(repair.id)}
                style={[
                  styles.repairCard,
                  selectedRepair === repair.id && styles.repairCardSelected,
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.repairIcon, { backgroundColor: `${repair.color}20` }]}>
                  <Ionicons name={repair.icon} size={28} color={repair.color} />
                </View>
                
                <View style={styles.repairInfo}>
                  <View style={styles.repairHeader}>
                    <Typography variant="h3" style={styles.repairTitle}>{repair.title}</Typography>
                    <Typography variant="caption" style={[styles.repairDuration, { color: repair.color }]}>
                      ~{repair.duration} min
                    </Typography>
                  </View>
                  <Typography variant="body" style={styles.repairDescription}>{repair.description}</Typography>
                </View>
                
                {selectedRepair === repair.id && (
                  <View style={styles.selectionIndicator}>
                    <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Repair Option */}
          <GlassCard style={styles.customCard} padding="large">
            <View style={styles.customRow}>
              <View style={[styles.customIcon, { backgroundColor: `${COLORS.textSecondary}20` }]}>
                <Ionicons name="add-circle" size={28} color={COLORS.textSecondary} />
              </View>
              <View style={styles.customInfo}>
                <Typography variant="h3" style={styles.customTitle}>Custom Repair</Typography>
                <Typography variant="caption" style={styles.customDesc}>
                  Nothing fits? Design your own repair attempt.
                </Typography>
              </View>
            </View>
          </GlassCard>

          {/* Execute Button */}
          <SquishyButton 
            onPress={handleExecuteRepair}
            disabled={!selectedRepair}
            variant={selectedRepair ? 'primary' : 'ghost'}
            size="large"
            style={styles.executeButton}
          >
            <Typography variant="button">
              {selectedRepair ? 'EXECUTE REPAIR' : 'SELECT A REPAIR FIRST'}
            </Typography>
          </SquishyButton>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
}

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.small,
    letterSpacing: 1,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.6,
  },
  instructionCard: {
    marginBottom: SPACING.xlarge,
    borderWidth: 1,
    borderColor: `${COLORS.vibrantPink}40`,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: SPACING.regular,
    alignItems: 'flex-start',
  },
  instructionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.tiny,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    color: COLORS.vibrantPink,
    marginBottom: SPACING.small,
    letterSpacing: 0.5,
  },
  instructionText: {
    lineHeight: 20,
    opacity: 0.8,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: SPACING.regular,
    letterSpacing: 1,
    color: COLORS.textSecondary,
    marginTop: SPACING.large,
  },
  repairsList: {
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  repairCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  repairCardSelected: {
    borderColor: COLORS.vibrantPink,
    borderWidth: 2,
    backgroundColor: `${COLORS.vibrantPink}10`,
  },
  repairIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repairInfo: {
    flex: 1,
  },
  repairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  repairTitle: {
    color: COLORS.textPrimary,
  },
  repairDuration: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
  repairDescription: {
    opacity: 0.7,
    lineHeight: 20,
  },
  selectionIndicator: {
    marginLeft: SPACING.small,
  },
  customCard: {
    marginBottom: SPACING.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderStyle: 'dashed',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
  },
  customIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInfo: {
    flex: 1,
  },
  customTitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.tiny,
  },
  customDesc: {
    opacity: 0.6,
  },
  executeButton: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.xxlarge,
  },
});