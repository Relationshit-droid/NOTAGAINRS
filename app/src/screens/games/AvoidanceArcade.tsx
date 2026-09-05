import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';

const PHRASES = ["I'll tell them later", "It's not a big deal", "They're busy", "I forgot", "Just this once"];
const HAMMER = "Say It Now";

export default function AvoidanceArcade({ navigation }: any) {
  const [moles, setMoles] = useState<boolean[]>(new Array(5).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    let moleTimer: any;

    if (active && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      moleTimer = setInterval(() => {
        const idx = Math.floor(Math.random() * 5);
        const newMoles = [...moles];
        // Randomly show/hide
        newMoles[idx] = Math.random() > 0.3;
        setMoles(newMoles);
      }, 800);
    } else if (timeLeft === 0 && active) {
      setActive(false);
    }

    return () => { clearInterval(interval); clearInterval(moleTimer); };
  }, [active, timeLeft, moles]);

  function whack(idx: number) {
    if (moles[idx]) {
      setScore(score + 5);
      const newMoles = [...moles];
      newMoles[idx] = false; // Whacked
      setMoles(newMoles);
    } else {
      setScore(Math.max(0, score - 2));
    }
  }

  function startGame() {
    setScore(0);
    setTimeLeft(30);
    setActive(true);
    setMoles(new Array(5).fill(false));
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundPrimary]} style={styles.background}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Typography variant="body">Back</Typography>
            </SquishyButton>
            <Typography variant="h1">Avoidance Arcade</Typography>
          </View>

          {/* Dr. Marcie Section */}
          <View style={styles.drMarcieSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
            </View>
            <View style={styles.quoteBox}>
              <Typography variant="sass">Face your avoidance patterns! Confrontation now prevents bigger issues later.</Typography>
            </View>
          </View>

          <GlassCard style={styles.scoreboard}>
            <Typography variant="h2">Score: {score}</Typography>
            <Typography variant="h2" style={timeLeft < 10 ? styles.timerTextUrgent : styles.timerTextNormal}>{timeLeft}s</Typography>
          </GlassCard>

          {!active ? (
            <GlassCard style={styles.instructionCard}>
              <Typography variant="h2">Whac-A-Mole: Avoidance Edition</Typography>
              <Typography variant="body" center>
                Tap the avoidance phrases before they disappear!
              </Typography>
              <SquishyButton onPress={startGame} style={styles.btn}>
                <Typography variant="button" style={styles.buttonText}>Start</Typography>
              </SquishyButton>
              {timeLeft === 0 && (
                  <Typography variant="body" style={styles.gameOverText}>
                      Marcie: "Game over. Don't avoid real life now."
                  </Typography>
              )}
            </GlassCard>
          ) : (
            <View style={styles.grid}>
              {PHRASES.map((phrase, i) => (
                <Pressable
                  key={i}
                  onPress={() => whack(i)}
                  style={[styles.mole, moles[i] ? styles.moleActive : styles.moleInactive]}
                >
                  <Typography variant="body" style={styles.moleText}>{moles[i] ? phrase : "..."}</Typography>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  background: { 
    flex: 1,
  },
  content: { 
    padding: SPACING.regular, 
    gap: SPACING.regular 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.large 
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
  scoreboard: { 
    padding: SPACING.regular, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  grid: { 
    gap: SPACING.regular 
  },
  mole: { 
    height: 60, 
    borderRadius: BORDER_RADIUS.large, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: SPACING.regular,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.small,
  },
  moleActive: { 
    backgroundColor: COLORS.vibrantPink,
  },
  moleInactive: { 
    backgroundColor: COLORS.backgroundInput,
  },
  moleText: { 
    color: COLORS.textPrimary, 
    fontWeight: 'bold',
  },
  btn: { 
    width: 200, 
  },
});
