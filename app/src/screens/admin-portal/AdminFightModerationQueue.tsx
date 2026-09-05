
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminFightModerationQueue = () => {
  const [fights, setFights] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fights'), (snapshot) => {
      const fightsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFights(fightsData);
    });
    return () => unsubscribe();
  }, []);

  const resolveFight = async (fightId) => {
    const fightRef = doc(db, 'fights', fightId);
    try {
      await updateDoc(fightRef, {
        status: 'resolved',
        verdict: 'Dr. Marcie has spoken!'
      });
    } catch (error) {
      console.error("Error resolving fight: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <GlassCard style={styles.fightItem} padding="medium">
      <Typography variant="body" style={styles.fightInfo}>
        Couple ID: {item.couple_id}
      </Typography>
      <Typography variant="body" style={styles.fightInfo}>
        Status: {item.status}
      </Typography>
      <SquishyButton
        onPress={() => resolveFight(item.id)}
        accessibilityLabel="Resolve fight"
        variant="primary"
        size="small"
        style={styles.button}
      >
        <Typography variant="button" color={COLORS.textPrimary}>
          Resolve
        </Typography>
      </SquishyButton>
    </GlassCard>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          SOS Fight Queue
        </Typography>
        <FlatList
          data={fights}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.healingHospital,
    padding: SPACING.regular,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: COLORS.emotionalConnection,
    marginBottom: SPACING.large,
  },
  listContent: {
    paddingBottom: SPACING.xlarge,
  },
  fightItem: {
    marginBottom: SPACING.regular,
  },
  fightInfo: {
    fontFamily: 'SweetPink-Regular',
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  button: {
    marginTop: SPACING.small,
  },
});

export default AdminFightModerationQueue;
