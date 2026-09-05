import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native';
import { Typography, GlassCard, ScreenLayout, SquishyButton } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function GratitudeGraffiti({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'gratitude-graffiti' };
  const [messages, setMessages] = useState<Array<{id: string, text: string, author: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const coupleId = useRef<string | null>(null);
  const [partnerMessages, setPartnerMessages] = useState<string[]>([]);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId.current = user.uid;
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        const couple_code = profileSnap.data()?.couple_code;

        if (couple_code) {
          coupleId.current = couple_code;
          
          const sessionRef = await addDoc(collection(db, 'game_sessions'), {
            gameId,
            userId: user.uid,
            couple_id: couple_code,
            createdAt: new Date(),
            state: { messages: [], currentInput: inputText },
          });
          setSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'game_sessions'),
            where('couple_id', '==', couple_code),
            where('gameId', '==', gameId),
            where('userId', '!=', user.uid) // Different user
          );
          
          const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                const data = change.doc.data();
                if (data.state?.messages) {
                  setPartnerMessages(data.state.messages);
                }
              }
            });
          });
          
          return () => unsubscribeSnapshot();
        }
      }
    });

    return () => unsubscribeAuth && unsubscribeAuth();
  }, [gameId]);

  const addMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        author: 'me'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            messages: [...messages, newMessage], 
            currentInput: '' 
          }
        });
      }
      
      setInputText('');
    }
  };

  const inputArea = (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <GlassCard>
        <LinearGradient
          colors={[COLORS.backgroundCard, 'rgba(240, 93, 104, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <Typography variant="h2" style={styles.wallTitle}>
            Gratitude Graffiti Wall
          </Typography>
          <Typography variant="body" style={styles.wallSubtitle}>
            Leave messages of appreciation for your partner
          </Typography>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Write something appreciative..."
              placeholderTextColor={COLORS.textHint}
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={3}
            />
          </View>

          <SquishyButton 
            onPress={addMessage}
            disabled={!inputText.trim()}
            style={[
              styles.addButton,
              !inputText.trim() && styles.disabledButton
            ]}
          >
            <Typography 
              variant="h3" 
              style={[
                styles.addButtonText,
                { color: inputText.trim() ? COLORS.textPrimary : COLORS.textDisabled }
              ]}
            >
              Add Message
            </Typography>
          </SquishyButton>
        </LinearGradient>
      </GlassCard>

      <GlassCard style={styles.wallContainer}>
        <Typography variant="h3" style={styles.messagesTitle}>
          Messages
        </Typography>
        
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, styles.myMessage]}>
              <Typography variant="body" style={styles.messageText}>{msg.text}</Typography>
              <Typography variant="caption" style={styles.messageAuthor}>
                Me
              </Typography>
            </View>
          ))}
          
          {partnerMessages.map((msg, index) => (
            <View key={`partner-${index}`} style={[styles.messageBubble, styles.partnerMessage]}>
              <Typography variant="body" style={styles.messageText}>{msg}</Typography>
              <Typography variant="caption" style={styles.messageAuthor}>
                Partner
              </Typography>
            </View>
          ))}
        </ScrollView>
      </GlassCard>
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Gratitude Graffiti',
    description: 'Leave messages of appreciation for your partner',
    category: 'emotional-connection' as const,
    difficulty: 'easy' as const,
    xpReward: 40,
    currentStep: messages.length,
    totalTime: 600,
    playerData: { 
      vulnerabilityScore: messages.length > 3 ? 80 : messages.length > 1 ? 60 : 40, 
      honestyScore: messages.length > 3 ? 85 : messages.length > 1 ? 65 : 45, 
      completionTime: 0, 
      partnerSync: partnerMessages.length > 0 ? 90 : 30 
    },
  };

  return (
    <GameContainer 
      state={baseState} 
      inputs={["text"]} 
      inputArea={inputArea} 
      onComplete={() => {
        if (sessionId) {
          const sessionRef = doc(db, 'game_sessions', sessionId);
          updateDoc(sessionRef, {
            finished_at: new Date().toISOString(),
            score: messages.length * 10,
            state: JSON.stringify({ completed: true, messageCount: messages.length })
          });
        }
        navigation.goBack();
      }} 
      sessionId={sessionId} 
    />
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xlarge,
  },
  gradientContainer: {
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.card,
  },
  wallTitle: {
    marginBottom: SPACING.medium,
    color: COLORS.textPrimary,
  },
  wallSubtitle: {
    marginBottom: SPACING.medium,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: SPACING.medium,
  },
  textInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.medium,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    borderRadius: BORDER_RADIUS.button,
    overflow: 'hidden',
    backgroundColor: COLORS.gradientStart,
    padding: SPACING.regular,
  },
  addButtonText: {
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.textDisabled,
    opacity: 0.5,
  },
  wallContainer: {
    marginTop: SPACING.medium,
    flex: 1,
  },
  messagesTitle: {
    marginBottom: SPACING.medium,
    color: COLORS.textPrimary,
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.medium,
    marginVertical: SPACING.small,
    maxWidth: '80%',
  },
  messageText: {
    color: COLORS.textPrimary,
  },
  messageAuthor: {
    color: COLORS.textHint,
    marginTop: SPACING.small,
    alignSelf: 'flex-end',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    borderLeftColor: COLORS.gradientStart,
    borderLeftWidth: 3,
  },
  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(198, 10, 179, 0.2)',
    borderRightColor: COLORS.profileRingEnd,
    borderRightWidth: 3,
  },
});
