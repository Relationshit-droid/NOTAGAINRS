import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebaseClient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const MatchmakingScreen = () => {
  const [myCode, setMyCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Generate a code to share with your partner, or enter their code to connect.');
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  let lobbyListener: any = null;

  const generateCode = async () => {
    if (myCode) {
      Alert.alert("Code already generated", `Your code is: ${myCode}`);
      return;
    }
    setIsSearching(true);
    setStatusMessage('Generating your unique connection code...');
    try {
      const lobbyRef = await addDoc(collection(db, 'lobbies'), {
        initiatorId: currentUser?.uid,
        status: 'waiting',
        createdAt: new Date(),
      });
      setMyCode(lobbyRef.id);
      setStatusMessage(`Your code is: ${lobbyRef.id}. Share it with your partner.`);

      lobbyListener = onSnapshot(doc(db, 'lobbies', lobbyRef.id), (doc) => {
        const data = doc.data();
        if (data && data.status === 'matched') {
          setIsSearching(false);
          if (lobbyListener) lobbyListener();
          navigation.navigate('GameLobby', { coupleId: doc.id });
        }
      });

    } catch (error) {
      Alert.alert('Error', 'Could not generate a code. Please try again.');
      setIsSearching(false);
      setStatusMessage('Failed to generate code. Please try again.');
    }
  };

  const connectToPartner = async () => {
    if (!partnerCode) {
      Alert.alert('No Code', 'Please enter your partner\'s code.');
      return;
    }
    setIsSearching(true);
    setStatusMessage(`Searching for partner with code: ${partnerCode}...`);

    try {
      const lobbyRef = doc(db, 'lobbies', partnerCode);
      const lobbySnap = await getDoc(lobbyRef);

      if (lobbySnap.exists() && lobbySnap.data()?.status === 'waiting') {
        await updateDoc(lobbyRef, {
          status: 'matched',
          joinerId: currentUser?.uid,
        });
        setIsSearching(false);
        navigation.navigate('GameLobby', { coupleId: partnerCode });
      } else {
        throw new Error('Lobby not found or already full.');
      }
    } catch (error: any) {
      Alert.alert('Connection Failed', error.message);
      setIsSearching(false);
      setStatusMessage('Connection failed. Please check the code and try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (lobbyListener) {
        lobbyListener();
      }
    };
  }, [lobbyListener]);

  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Connect with your partner to begin your journey together."
      scrollable={true}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            Connect with Your Partner
          </Typography>
          
          <Typography variant="body" style={styles.statusText}>
            {statusMessage}
          </Typography>

          {isSearching && (
            <ActivityIndicator 
              size="large" 
              color={COLORS.vibrantPink} 
              style={styles.loader}
            />
          )}

          <GlassCard style={styles.card}>
            <Typography variant="h3" style={styles.cardTitle}>
              Share Your Code
            </Typography>
            <Typography variant="body" style={styles.cardDescription}>
              Generate a unique code and share it with your partner to connect.
            </Typography>
            <SquishyButton 
              onPress={generateCode}
              variant="primary"
              size="large"
            >
              {myCode ? `Code: ${myCode}` : 'Generate Code'}
            </SquishyButton>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Typography variant="h3" style={styles.cardTitle}>
              Enter Partner's Code
            </Typography>
            <Typography variant="body" style={styles.cardDescription}>
              Have a code? Enter it below to join your partner.
            </Typography>
            <TextInput
              placeholder="Enter code..."
              placeholderTextColor={COLORS.textHint}
              value={partnerCode}
              onChangeText={setPartnerCode}
              style={styles.input}
            />
            <SquishyButton 
              onPress={connectToPartner}
              variant="primary"
              size="large"
            >
              Connect
            </SquishyButton>
          </GlassCard>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.xlarge,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    opacity: 0.8,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  card: {
    marginBottom: SPACING.xl,
    padding: SPACING.xlarge,
  },
  cardTitle: {
    marginBottom: SPACING.small,
  },
  cardDescription: {
    marginBottom: SPACING.large,
    opacity: 0.7,
  },
  input: {
    marginBottom: SPACING.large,
    height: 52,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
});

export default MatchmakingScreen;
