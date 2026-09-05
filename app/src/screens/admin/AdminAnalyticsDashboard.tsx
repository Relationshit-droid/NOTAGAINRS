
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminAnalyticsDashboard = () => {
  const [dailyActiveUsers, setDailyActiveUsers] = useState(0);
  const [retention, setRetention] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsUnsub = onSnapshot(collection(db, 'sessions'), (snapshot) => {
      let activeToday = 0;
      snapshot.forEach(doc => {
        const sessionDate = doc.data().timestamp.toDate();
        if (sessionDate >= today) {
          activeToday++;
        }
      });
      setDailyActiveUsers(activeToday);
      setTotalSessions(snapshot.size);
    });

    const retentionUnsub = onSnapshot(collection(db, 'analytics'), (snapshot) => {
        const retentionData = snapshot.docs.find(doc => doc.id === 'retention_d30');
        if (retentionData) {
            setRetention(retentionData.data().value);
        }
    });

    return () => {
      sessionsUnsub();
      retentionUnsub();
    };
  }, []);

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <Typography variant="h1" color={COLORS.textPrimary}>
        Analytics Dashboard
      </Typography>
      <Typography variant="body" color={COLORS.textSecondary} style={{ marginBottom: SPACING.xlarge }}>
        Real-time performance overview of the cosmic nebula ecosystem
      </Typography>

      <View style={styles.kpiGrid}>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Daily Active Users
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {dailyActiveUsers}
          </Typography>
        </GlassCard>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Retention (D30)
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {retention}%
          </Typography>
        </GlassCard>
        <GlassCard style={styles.kpiCard}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Total Sessions
          </Typography>
          <Typography variant="h2" color={COLORS.textPrimary}>
            {totalSessions}
          </Typography>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xlarge,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    marginHorizontal: SPACING.tiny,
    marginBottom: SPACING.regular,
    minWidth: '30%',
  },
});

export default AdminAnalyticsDashboard;
