import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';

import { ScreenLayout, GlassCard, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const BINGO_SQUARES = [
  { id: '1', text: '"Can you not look at your phone while I\'m talking?"' },
  { id: '2', text: '"I need some alone time tonight."' },
  { id: '3', text: '"Please don\'t raise your voice at me."' },
  { id: '4', text: '"I\'m not comfortable discussing that with your family."' },
  { id: '5', text: '"It\'s not okay to make jokes about that."' },
  // ... add all 25 squares
].concat(Array.from({ length: 20 }, (_, i) => ({ id: (i + 6).toString(), text: `Boundary #${i+6}` })))

const BoundaryBingoScreen = () => {
  const [markedSquares, setMarkedSquares] = useState<{ [key: string]: 'YES' | 'NO' }>({});

  const handlePress = (id: string) => {
    setMarkedSquares(prev => ({
        ...prev,
        [id]: prev[id] === 'YES' ? 'NO' : 'YES'
    }));
  }

  const renderItem = ({ item }: { item: { id: string; text: string } }) => (
    <GlassCard 
      style={styles.bingoSquare}
      onPress={() => handlePress(item.id)}
    >
      <Typography variant="caption" center style={styles.bingoText}>{item.text}</Typography>
      {markedSquares[item.id] && (
          <View style={[styles.marker, markedSquares[item.id] === 'YES' ? styles.yesMarker : styles.noMarker]}>
              <Typography variant="h2" style={styles.markerText}>{markedSquares[item.id]}</Typography>
          </View>
      )}
    </GlassCard>
  );

  return (
    <ScreenLayout showHeader={false} scrollable={true}>

        <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
        
        {/* Dr. Marcie Section */}
        <GlassCard style={styles.drMarcieSection} variant="outlined">
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="body">Establish healthy boundaries! Clear communication protects both partners' wellbeing.</Typography>
          </View>
        </GlassCard>
        
        <View style={styles.content}>
          <FlatList
            data={BINGO_SQUARES}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={5}
            contentContainerStyle={styles.grid}
          />
        </View>

    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.backgroundPrimary 
  },
  gameTitle: {
    marginTop: SPACING.regular,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.small,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: SPACING.regular,
    marginBottom: SPACING.small,
    padding: SPACING.regular,
  },
  avatarContainer: {
    width: SPACING.xxlarge + SPACING.medium,
    height: SPACING.xxlarge + SPACING.medium,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  avatar: {
    width: SPACING.xxlarge,
    height: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
  content: { 
    flex: 1, 
    padding: SPACING.small 
  },
  grid: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bingoSquare: {
    width: 70,
    height: 70,
    margin: SPACING.micro,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.tiny,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.small,
  },
  bingoText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  marker: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.large,
  },
  yesMarker: {
      backgroundColor: 'rgba(55, 207, 151, 0.7)', // mintGreen with opacity
  },
  noMarker: {
      backgroundColor: 'rgba(219, 20, 124, 0.7)', // gradientStart with opacity
  },
  markerText: {
      color: COLORS.textPrimary,
  }
});

export default BoundaryBingoScreen;
