import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { Typography, SquishyButton } from '../ui';

interface GameHeaderProps {
  title: string;
  icon?: string;
  onExit: () => void;
  timer?: number;
  partnerOnline?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  icon,
  onExit,
  timer,
  partnerOnline = true,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <SquishyButton onPress={onExit} variant="ghost" style={styles.exitButton}>
          <Ionicons name="close" size={TYPOGRAPHY.fontSize.displaySmall} color={COLORS.textPrimary} />
        </SquishyButton>
        {icon && (
          <Typography variant="body" style={styles.icon}>{icon}</Typography>
        )}
        <Typography variant="header" style={styles.title}>{title}</Typography>
      </View>

      <View style={styles.rightSection}>
        {timer !== undefined && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={TYPOGRAPHY.fontSize.bodyMedium} color={COLORS.vibrantPink} />
            <Typography variant="body" color={COLORS.vibrantPink} style={styles.timer}>
              {formatTime(timer)}
            </Typography>
          </View>
        )}
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            partnerOnline ? styles.onlineDot : styles.offlineDot
          ]} />
          <Typography variant="caption" style={[
            styles.statusText,
            partnerOnline ? styles.onlineText : styles.offlineText
          ]}>
            {partnerOnline ? 'Partner Online' : 'Waiting...'}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.regular,
    backgroundColor: COLORS.backgroundInput,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252, 12, 132, 0.3)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitButton: {
    padding: SPACING.small,
    marginRight: SPACING.medium,
  },
  icon: {
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    marginRight: SPACING.small,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(252, 12, 132, 0.2)',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.xxlarge,
    marginRight: SPACING.medium,
  },
  timer: {
    marginLeft: SPACING.tiny,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: SPACING.small,
    height: SPACING.small,
    borderRadius: BORDER_RADIUS.small / 2,
    marginRight: SPACING.tiny,
  },
  onlineDot: {
    backgroundColor: COLORS.success,
    ...SHADOWS.small,
    shadowColor: COLORS.success,
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  offlineDot: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  onlineText: {
    color: COLORS.success,
  },
  offlineText: {
    color: COLORS.error,
  },
});

export default GameHeader;
