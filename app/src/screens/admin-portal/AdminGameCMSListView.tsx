
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

type CmsGame = {
  id: string;
  title: string;
};


const AdminGameCMSListView = () => {
  const [games, setGames] = useState<CmsGame[]>([]);
  const navigation = useAppNavigation();

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, 'game_library'));
      const gamesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesData);
    };
    fetchGames();
  }, []);

  const renderItem = ({ item }: { item: CmsGame }) => (
    <GlassCard
      onPress={() => navigation.navigate('AdminGameEditor', { game: item })}
      padding="medium"
      style={styles.gameItem}
    >
      <Typography variant="h4" style={styles.gameTitle}>
        {item.title}
      </Typography>
    </GlassCard>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          Game CMS
        </Typography>
        <FlatList
          data={games}
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
  gameItem: {
    marginBottom: SPACING.regular,
  },
  gameTitle: {
    fontFamily: 'SweetPink-Regular',
    color: COLORS.textPrimary,
  },
});

export default AdminGameCMSListView;
