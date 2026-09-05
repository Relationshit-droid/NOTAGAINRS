import { useEffect, useState, useRef } from 'react';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { View, StyleSheet, TextInput, ScrollView, Animated as RNAnimated, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Typography, GlassCard, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from '../../utils/haptics';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { COLORS, GRADIENTS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

type CoupleCodeScreenProps = {
  onNext?: (code: string) => void;
};

export default function CoupleCodeScreen({ onNext }: CoupleCodeScreenProps) {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [code, setCode] = useState<string>('');
  const [partnerCode, setPartnerCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [hasCouple, setHasCouple] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const generateAndSaveCode = async () => {
      const newCode = generateCoupleCode();
      setCode(newCode);
      
      if (user) {
        try {
          const token = await user.getIdToken();
          // Check if user already has a couple
          const me = await coupleApi.getCoupleForUser(user.uid, token);
          if (me && me.id) {
            setHasCouple(true);
            setCode(me.invite_code || newCode);
            if (onNext) { onNext(me.invite_code || newCode); } else { navigation.navigate('MainApp'); }
          }
        } catch (e) {
          console.log('No existing couple, will create new code');
        }
      }
    };
    
    generateAndSaveCode();

    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start();
  }, [user]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handlePartnerCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      const newCode = [...partnerCode];
      for (let i = 0; i < Math.min(text.length, 6 - index); i++) {
        newCode[index + i] = text[i];
      }
      setPartnerCode(newCode);
      if (index + text.length < 6) {
        inputs.current[index + text.length]?.focus();
      } else {
        inputs.current[index]?.blur();
      }
      return;
    }

    const newCode = [...partnerCode];
    newCode[index] = text;
    setPartnerCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const createCouple = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }
    
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const result = await coupleApi.createCouple(user.uid, token);
      setCode(result.invite_code);
      setHasCouple(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Failed to Create Couple', e.message);
    } finally {
      setLoading(false);
    }
  };

  const connectSignal = async () => {
    Haptics.selectionAsync();
    const fullCode = partnerCode.join('').toUpperCase();
    if (fullCode.length !== 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'Please enter a full 6-digit code.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const result = await coupleApi.joinCouple(user.uid, fullCode, token);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onNext) { onNext(fullCode); } else { navigation.navigate('MainApp'); }

    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Connection Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.vibrantPink} size="large" />
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Typography variant="label" style={styles.headerTitle}>CONNECTION SYNC</Typography>
            <Typography variant="body" style={styles.phaseText}>PHASE 1 / 5</Typography>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient colors={GRADIENTS.progress.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '20%', height: '100%' }} />
          </View>
        </View>

        <View style={styles.titleSec}>
          <Typography variant="header" style={styles.mainTitle}>Couple Linking</Typography>
          <Typography variant="body" style={styles.subSubtitle}>Resonate your frequencies to begin.</Typography>
        </View>

        <View style={styles.cardsContainer}>
          <GlassCard style={styles.card} variant="elevated">
            <Ionicons name="wifi" size={32} color={COLORS.aquaTeal} style={{ alignSelf: 'center' }} />
            <Typography variant="label" style={styles.cardHeader}>YOUR FREQUENCY</Typography>
            <Typography variant="header" style={styles.codeDisplay}>{code || 'Generating...'}</Typography>
            {!hasCouple ? (
              <SquishyButton onPress={createCouple} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : (
                  <>
                    <Ionicons name="add-circle-outline" size={18} color={COLORS.textPrimary} />
                    <Typography variant="button" style={{ marginLeft: SPACING.small }}>CREATE COUPLE CODE</Typography>
                  </>
                )}
              </SquishyButton>
            ) : (
              <SquishyButton onPress={handleCopy}>
                <Ionicons name="copy-outline" size={18} color={COLORS.textPrimary} />
                <Typography variant="button" style={{ marginLeft: SPACING.small }}>COPY CODE</Typography>
              </SquishyButton>
            )}
          </GlassCard>

          <GlassCard style={styles.card} variant="elevated">
            <Ionicons name="link" size={32} color={COLORS.vibrantPink} style={{ alignSelf: 'center' }} />
            <Typography variant="label" style={styles.cardHeader}>ENTER PARTNER'S CODE</Typography>

            <View style={styles.inputRow}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <TextInput
                  key={i}
                  ref={r => { inputs.current[i] = r; }}
                  style={styles.codeDigit}
                  maxLength={1}
                  value={partnerCode[i]}
                  onChangeText={(t) => handlePartnerCodeChange(t, i)}
                  keyboardType="default"
                  autoCapitalize="characters"
                  placeholder="•"
                  placeholderTextColor={COLORS.textHint}
                  editable={!loading}
                />
              ))}
            </View>

            <SquishyButton onPress={connectSignal} disabled={loading || hasCouple}>
              {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : (
                <>
                  <Typography variant="button">CONNECT SIGNAL</Typography>
                  <Ionicons name="heart" size={20} color={COLORS.vibrantPink} style={{ marginLeft: SPACING.small }} />
                </>
              )}
            </SquishyButton>
          </GlassCard>
        </View>

        {!hasCouple && (
          <View style={styles.waiting}>
            <View style={styles.pulseContainer}>
              <View style={styles.dot} />
              <View style={[styles.dotPing, { position: 'absolute' }]} />
            </View>
            <RNAnimated.Text style={[styles.waitingText, { opacity: pulseAnim }]}>Waiting for Partner...</RNAnimated.Text>
          </View>
        )}

        <View style={{ height: SPACING.xxlarge }} />
      </ScrollView>
    </ScreenLayout>
  );
}

function generateCoupleCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => new Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return segment();
}

const styles = StyleSheet.create({
  scroll: { 
    padding: SPACING.screenPadding 
  },
  header: { 
    marginBottom: SPACING.xlarge 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: SPACING.small 
  },
  headerTitle: { 
    color: COLORS.textSecondary 
  },
  phaseText: { 
    color: COLORS.aquaTeal 
  },
  progressBar: { 
    height: 4, 
    backgroundColor: COLORS.divider, 
    borderRadius: BORDER_RADIUS.small, 
    overflow: 'hidden' 
  },
  titleSec: { 
    alignItems: 'center', 
    marginBottom: SPACING.large 
  },
  mainTitle: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge 
  },
  subSubtitle: { 
    color: COLORS.textSecondary 
  },
  cardsContainer: { 
    gap: SPACING.large 
  },
  card: { 
    padding: SPACING.xlarge, 
    alignItems: 'center', 
    gap: SPACING.regular 
  },
  cardHeader: { 
    color: COLORS.textSecondary 
  },
  codeDisplay: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge, 
    color: COLORS.aquaTeal, 
    letterSpacing: 4 
  },
  inputRow: { 
    flexDirection: 'row', 
    gap: SPACING.small, 
    justifyContent: 'center' 
  },
  codeDigit: { 
    width: 40, 
    height: 50, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.medium, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    color: COLORS.textPrimary, 
    fontSize: TYPOGRAPHY.fontSize.displaySmall, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  waiting: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: SPACING.regular, 
    marginTop: SPACING.xxlarge, 
    opacity: 0.6 
  },
  waitingText: { 
    color: COLORS.textPrimary 
  },
  pulseContainer: { 
    width: 10, 
    height: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.warmOrange 
  },
  dotPing: { 
    width: 10, 
    height: 10, 
    borderRadius: BORDER_RADIUS.round, 
    backgroundColor: COLORS.warmOrange, 
    opacity: 0.5 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});