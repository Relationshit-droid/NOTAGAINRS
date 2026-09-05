import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

/**
 * Builds the list of "played" day keys (YYYY-MM-DD) for the given month.
 * Used as demo seed data until real streak history is fetched from Firestore.
 */
function generateMockMonthlyData(date: Date): string[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const days: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (d > today) continue;
    // Deterministic pseudo-pattern so the calendar looks lived-in but stable
    // across renders (no Math.random, which would flicker on every re-render).
    if ((day * 7 + month * 3) % 10 < 6) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      days.push(`${year}-${mm}-${dd}`);
    }
  }
  return days;
}

export default function StreakCalendarScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streakData, setStreakData] = useState({
    currentStreak: 7,
    longestStreak: 21,
    totalDaysPlayed: 45,
    weeklyGoal: 5,
    thisWeekPlayed: 3,
    monthlyData: generateMockMonthlyData(new Date()),
  });
  const [loading, setLoading] = useState(false);

  const fetchStreakData = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple) {
        setStreakData(prev => ({
          ...prev,
          currentStreak: couple.streak_days,
          // In real app, fetch detailed streak history from backend
        }));
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, [user, userId]);

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && 
                         currentMonth.getFullYear() === new Date().getFullYear();

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false, played: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const played = streakData.monthlyData.includes(dateStr);
      const isToday = isCurrentMonth && i === new Date().getDate();
      days.push({ day: i, currentMonth: true, played, isToday, dateStr });
    }
    
    // Next month leading days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, played: false });
    }
    
    return days;
  }, [currentMonth, streakData.monthlyData]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Streak Summary Cards */}
        <View style={styles.summaryRow}>
          <StreakCard 
            title="Current Streak" 
            value={streakData.currentStreak} 
            subtitle="days in a row"
            icon="flame"
            color={COLORS.warmOrange}
            gradient={GRADIENTS.romanceHub}
          />
          <StreakCard 
            title="Longest Streak" 
            value={streakData.longestStreak} 
            subtitle="your record"
            icon="trophy"
            color={COLORS.brightYellow}
            gradient={GRADIENTS.progress}
          />
        </View>
        <View style={styles.summaryRow}>
          <StreakCard 
            title="Total Days" 
            value={streakData.totalDaysPlayed} 
            subtitle="played together"
            icon="calendar"
            color={COLORS.mintGreen}
            gradient={[COLORS.mintGreen, COLORS.aquaTeal]}
          />
          <StreakCard 
            title="This Week" 
            value={`${streakData.thisWeekPlayed}/${streakData.weeklyGoal}`} 
            subtitle="weekly goal"
            icon="flag"
            color={COLORS.vibrantPink}
            gradient={GRADIENTS.primary}
          />
        </View>

        {/* Weekly Progress Bar */}
        <GlassCard style={styles.weeklyProgressCard} variant="elevated">
          <Typography variant="label" style={styles.weeklyProgressTitle}>WEEKLY PROGRESS</Typography>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <View style={[
                styles.progressBarFill,
                { 
                  width: `${Math.min(100, (streakData.thisWeekPlayed / streakData.weeklyGoal) * 100)}%`,
                  backgroundColor: streakData.thisWeekPlayed >= streakData.weeklyGoal ? COLORS.mintGreen : COLORS.vibrantPink,
                }
              ]} />
            </View>
            <Typography variant="caption" style={styles.progressLabel}>
              {streakData.thisWeekPlayed} of {streakData.weeklyGoal} sessions completed
            </Typography>
            {streakData.thisWeekPlayed >= streakData.weeklyGoal && (
              <Typography variant="caption" style={styles.goalMetText}>
                🎉 Weekly goal achieved! Keep the momentum!
              </Typography>
            )}
          </View>
        </GlassCard>

        {/* Calendar */}
        <GlassCard style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Typography variant="header" style={styles.calendarTitle}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <TouchableOpacity onPress={nextMonth} disabled={isCurrentMonth} style={[styles.navButton, isCurrentMonth && styles.navButtonDisabled]}>
              <Ionicons name="chevron-forward" size={24} color={isCurrentMonth ? COLORS.textHint : COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map(day => (
              <Typography key={day} variant="caption" style={styles.dayName}>{day}</Typography>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {daysInMonth.map((day, index) => (
              <CalendarDay 
                key={index} 
                day={day} 
                today={day.isToday}
              />
            ))}
          </View>
        </GlassCard>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.mintGreen }]} />
            <Typography variant="caption" style={styles.legendText}>Played together</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.vibrantPink + '40', borderWidth: 1, borderColor: COLORS.vibrantPink }]} />
            <Typography variant="caption" style={styles.legendText}>Today</Typography>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.backgroundSecondary }]} />
            <Typography variant="caption" style={styles.legendText}>No session</Typography>
          </View>
        </View>

        {/* Milestones */}
        <GlassCard style={styles.milestonesCard}>
          <Typography variant="label" style={styles.milestonesTitle}>STREAK MILESTONES</Typography>
          <View style={styles.milestonesList}>
            {[
              { days: 3, label: 'First Spark', icon: 'sparkles', unlocked: streakData.currentStreak >= 3 || streakData.longestStreak >= 3 },
              { days: 7, label: 'Week Warrior', icon: 'flame', unlocked: streakData.currentStreak >= 7 || streakData.longestStreak >= 7 },
              { days: 14, label: 'Fortnight Fighter', icon: 'shield', unlocked: streakData.longestStreak >= 14 },
              { days: 21, label: 'Habit Hero', icon: 'star', unlocked: streakData.longestStreak >= 21 },
              { days: 30, label: 'Monthly Master', icon: 'trophy', unlocked: streakData.longestStreak >= 30 },
              { days: 60, label: 'Connection Champion', icon: 'crown', unlocked: streakData.longestStreak >= 60 },
              { days: 100, label: 'Century Club', icon: 'diamond', unlocked: streakData.longestStreak >= 100 },
            ].map((milestone, index) => (
              <MilestoneRow key={milestone.days} milestone={milestone} />
            ))}
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const StreakCard = ({ title, value, subtitle, icon, color, gradient }: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: string; 
  color: string; 
  /** Either a raw colour array or a design-system gradient token. */
  gradient: string[] | { colors: string[] } 
}) => (
  <TouchableOpacity style={styles.streakCard}>
    <LinearGradient
      colors={Array.isArray(gradient) ? gradient : gradient.colors}
      style={styles.cardIcon}
    >
      <Ionicons name={icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.cardValue}>{value}</Typography>
    <Typography variant="label" style={styles.cardTitle}>{title}</Typography>
    <Typography variant="caption" style={styles.cardSubtitle}>{subtitle}</Typography>
  </TouchableOpacity>
);

const CalendarDay = ({ day, today }: { day: any; today: boolean }) => {
  if (!day.currentMonth) {
    return <View style={styles.emptyDay} />;
  }
  
  return (
    <TouchableOpacity 
      style={[
        styles.dayCell,
        day.played && styles.dayPlayed,
        today && styles.dayToday,
        !day.currentMonth && styles.dayOtherMonth,
      ]}
    >
      <Typography 
        variant="caption" 
        style={[
          styles.dayNumber,
          day.played && styles.dayNumberPlayed,
          today && styles.dayNumberToday,
        ]}
      >
        {day.day}
      </Typography>
      {day.played && (
        <View style={styles.playedDot} />
      )}
    </TouchableOpacity>
  );
};

const MilestoneRow = ({ milestone }: { milestone: any }) => (
  <View style={[
    styles.milestoneRow,
    milestone.unlocked && styles.milestoneUnlocked,
  ]}>
    <View style={[
      styles.milestoneIcon,
      milestone.unlocked ? { backgroundColor: COLORS.mintGreen } : { backgroundColor: COLORS.backgroundSecondary },
    ]}>
      <Ionicons name={milestone.icon} size={20} color={milestone.unlocked ? COLORS.textPrimary : COLORS.textHint} />
    </View>
    <View style={styles.milestoneInfo}>
      <Typography variant="label" style={[
        styles.milestoneLabel,
        milestone.unlocked ? { color: COLORS.textPrimary } : { color: COLORS.textSecondary },
      ]}>
        {milestone.label}
      </Typography>
      <Typography variant="caption" style={[
        styles.milestoneDays,
        milestone.unlocked ? { color: COLORS.textSecondary } : { color: COLORS.textHint },
      ]}>
        {milestone.days} days
      </Typography>
    </View>
    {milestone.unlocked && (
      <Ionicons name="checkmark-circle" size={24} color={COLORS.mintGreen} />
    )}
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  streakCard: {
    flex: 1,
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  cardValue: {
    marginBottom: SPACING.tiny,
  },
  cardTitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.tiny,
  },
  cardSubtitle: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 10,
  },
  weeklyProgressCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  weeklyProgressTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.regular,
    color: COLORS.vibrantPink,
  },
  progressBarContainer: {
    gap: SPACING.small,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  goalMetText: {
    color: COLORS.mintGreen,
    textAlign: 'center',
    fontWeight: '600',
  },
  calendarCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  calendarTitle: {
    textAlign: 'center',
    flex: 1,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.regular,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.textHint,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    margin: 1,
  },
  dayPlayed: {
    backgroundColor: COLORS.mintGreen + '20',
  },
  dayToday: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
  },
  dayOtherMonth: {
    opacity: 0.3,
  },
  dayNumber: {
    color: COLORS.textSecondary,
  },
  dayNumberPlayed: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  dayNumberToday: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
  },
  playedDot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.mintGreen,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xlarge,
    marginBottom: SPACING.xlarge,
    paddingHorizontal: SPACING.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
  },
  legendText: {
    color: COLORS.textSecondary,
  },
  milestonesCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  milestonesTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  milestonesList: {
    gap: SPACING.regular,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  milestoneUnlocked: {
    backgroundColor: COLORS.mintGreen + '15',
    borderWidth: 1,
    borderColor: COLORS.mintGreen + '40',
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneLabel: {
    marginBottom: SPACING.tiny,
  },
  milestoneDays: {
    fontSize: 12,
  },
});