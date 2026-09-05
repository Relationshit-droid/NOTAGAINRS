import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const LOTS = [
  { text: "You fold laundry like a Zen master.", real: true, cost: 50 },
  { text: "I love how you chew gum loudly.", real: false, cost: 10 },
  { text: "Your smile when you see a dog.", real: true, cost: 80 },
];

export default function AppreciationAuction({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);
  const [coins, setCoins] = useState(100);

  function bid(amount: number) {
    if (coins < amount) {
      speakMarcie("Insufficient funds, darling.");
      HapticFeedbackSystem.error();
      return;
    }
    setCoins(c => c - amount);
    if (LOTS[index].real) {
      HapticFeedbackSystem.success();
      speakMarcie("Sold! A genuine appreciation.");
    } else {
      HapticFeedbackSystem.warning();
      speakMarcie("You bought a fake? Awkward.");
    }

    if (index < LOTS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Auction Closed", `Remaining Coins: ${coins}`, [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  function pass() {
    if (LOTS[index].real) {
      speakMarcie("You passed on a real one? Someone's missing out.");
    } else {
      speakMarcie("Smart pass. That was AI garbage.");
    }
    if (index < LOTS.length - 1) {
      setIndex(i => i + 1);
    } else {
      Alert.alert("Auction Closed", `Remaining Coins: ${coins}`, [{ text: "Done", onPress: () => navigation.goBack() }]);
    }
  }

  const inputArea = (
    <View style={styles.inputArea}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="sass">Bid on authentic appreciation! Distinguish genuine compliments from fake ones.</Typography>
          </View>
        </View>

        <Typography variant="h2" center>Lot #{index + 1}</Typography>
        <Typography variant="sass" center style={styles.lot}>"{LOTS[index].text}"</Typography>
        <Typography variant="keyword" center>Balance: {coins} Coins</Typography>
        <View style={styles.actions}>
          <SquishyButton onPress={() => bid(LOTS[index].cost)} style={styles.bidBtn}>
            <Typography variant="button" style={styles.buttonText}>Bid {LOTS[index].cost}</Typography>
          </SquishyButton>
          <SquishyButton onPress={pass} style={styles.passBtn}>
            <Typography variant="button" style={styles.buttonText}>Pass</Typography>
          </SquishyButton>
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Appreciation Auction',
    description: 'Bid on real vs fake appreciations',
    category: 'emotional' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  inputArea: {
    gap: SPACING.regular,
  },
  buttonText: {
    color: COLORS.textPrimary,
  },
  lot: {
    textAlign: 'center', 
    marginVertical: SPACING.regular, 
    color: COLORS.textPrimary,
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
  },
  actions: { 
    flexDirection: 'row', 
    gap: SPACING.regular, 
    justifyContent: 'center', 
    marginTop: SPACING.regular 
  },
  bidBtn: { 
    flex: 1, 
  },
  passBtn: { 
    flex: 1, 
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular
  },
});
