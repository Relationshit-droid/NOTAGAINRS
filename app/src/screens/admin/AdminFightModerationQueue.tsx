
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

type QueuedFight = {
  id: string;
  coupleId: string;
  timestamp?: any;
};


const AdminFightModerationQueue = () => {
  const [activeFights, setActiveFights] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "sos_alerts"), where("status", "==", "active"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fights = [];
      querySnapshot.forEach((doc) => {
        fights.push({ id: doc.id, ...doc.data() });
      });
      setActiveFights(fights);
    });

    return () => unsubscribe();
  }, []);

  const resolveFight = async (id: string) => {
    try {
      const fightRef = doc(db, "sos_alerts", id);
      await updateDoc(fightRef, {
        status: "resolved",
        resolvedAt: new Date(),
      });
      Alert.alert("Fight Resolved", `SOS session ${id} has been marked as resolved.`);
    } catch (error) {
      Alert.alert("Error", "Could not resolve the fight: " + error.message);
    }
  };

  const renderFightItem = ({ item }: { item: QueuedFight }) => (
    <GlassCard style={styles.fightItem}>
      <View style={styles.fightDetails}>
        <Typography variant="body" color={COLORS.textPrimary} style={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>
          {item.coupleId}
        </Typography>
        <Typography variant="caption" color={COLORS.textSecondary}>
          {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
        </Typography>
      </View>
      <View style={styles.fightActions}>
        <SquishyButton
          onPress={() => resolveFight(item.id)}
          variant="primary"
          size="small"
        >
          <Typography variant="button" color={COLORS.deepCosmic}>
            RESOLVE
          </Typography>
        </SquishyButton>
      </View>
    </GlassCard>
  );

  return (
    <ScreenLayout
      showHeader={true}
      scrollable={true}
    >
      <Typography variant="h1" color={COLORS.textPrimary} style={{ marginBottom: SPACING.xlarge }}>
        Fight Moderation Queue
      </Typography>
      <FlatList
        data={activeFights}
        renderItem={renderFightItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Typography variant="body" color={COLORS.textSecondary} center style={{ marginTop: SPACING.xxxlarge }}>
            No active fights to moderate.
          </Typography>
        }
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  fightItem: {
    marginBottom: SPACING.regular,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fightDetails: {
    flex: 1,
  },
  fightActions: {},
});

export default AdminFightModerationQueue;
