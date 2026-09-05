import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Modal, TextInput, Pressable } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SOSModal({ visible, onClose, navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sosSessionId, setSosSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    i_feel: '',
    when_partner: '',
    because_i_tell_myself: '',
    what_i_need: ''
  });
  const [sessionData, setSessionData] = useState<any>(null);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  useEffect(() => {
    if (visible) {
      const user = auth.currentUser;
      if (user) {
        // Create a new SOS session
        const createSession = async () => {
          const sessionRef = await addDoc(collection(db, 'sos_sessions'), {
            initiator_id: user.uid,
            couple_id: null, // Will be populated when partner joins
            status: "waiting_for_partner",
            started_at: new Date(),
            submissions: {},
            verdict: null
          });
          
          setSosSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'sos_sessions'),
            where('id', '==', sessionRef.id)
          );
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "modified") {
                const data = change.doc.data();
                setSessionData(data);
                
                // Check if partner has submitted
                if (data.submissions && Object.keys(data.submissions).length > 1) {
                  setPartnerSubmitted(true);
                }
              }
            });
          });
          
          return () => unsubscribe();
        };
        
        createSession();
      }
    } else {
      // Reset when modal closes
      setCurrentStep(0);
      setFormData({
        i_feel: '',
        when_partner: '',
        because_i_tell_myself: '',
        what_i_need: ''
      });
    }
  }, [visible]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    if (!sosSessionId) return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    // Submit the form data
    const sessionRef = doc(db, 'sos_sessions', sosSessionId);
    await updateDoc(sessionRef, {
      [`submissions.${user.uid}`]: {
        i_feel: formData.i_feel,
        when_partner: formData.when_partner,
        because_i_tell_myself: formData.because_i_tell_myself,
        what_i_need: formData.what_i_need,
        submitted_at: new Date()
      }
    });
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the session
      await updateDoc(sessionRef, {
        status: "submitted"
      });
      onClose();
    }
  };

  const steps = [
    {
      title: "I Feel...",
      field: "i_feel",
      placeholder: "Describe your emotion...",
      helper: "Name the feeling you're experiencing",
      icon: "heart-outline"
    },
    {
      title: "When Partner...",
      field: "when_partner",
      placeholder: "What did your partner do?",
      helper: "Describe the specific behavior or action",
      icon: "person-outline"
    },
    {
      title: "Because I Tell Myself...",
      field: "because_i_tell_myself",
      placeholder: "What story are you telling yourself?",
      helper: "Identify your internal narrative",
      icon: "chatbubble-outline"
    },
    {
      title: "What I Need...",
      field: "what_i_need",
      placeholder: "What would help you feel better?",
      helper: "Express your specific need",
      icon: "hand-left-outline"
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={onClose}
        />
        
        <View style={styles.modalContent}>
          <GlassCard style={styles.modalCard}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.header}>
                <Typography variant="h2" style={styles.headerTitle}>
                  SOS: Fight Solver
                </Typography>
                <SquishyButton 
                  onPress={onClose} 
                  variant="ghost"
                  size="small"
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </SquishyButton>
              </View>
              
              <Typography variant="small" style={styles.stepIndicator}>
                Step {currentStep + 1} of {steps.length}
              </Typography>
              
              {/* Step Dots */}
              <View style={styles.stepDots}>
                {steps.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.stepDot, 
                      index === currentStep && styles.activeStepDot,
                      index < currentStep && styles.completedStepDot
                    ]} 
                  />
                ))}
              </View>
              
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name={currentStepData.icon as any} 
                      size={32} 
                      color={COLORS.vibrantPink} 
                    />
                  </View>
                  <Typography variant="h3" style={styles.stepTitle}>
                    {currentStepData.title}
                  </Typography>
                </View>
                
                <Typography variant="body" style={styles.stepHelper}>
                  {currentStepData.helper}
                </Typography>
                
                <TextInput
                  placeholder={currentStepData.placeholder}
                  placeholderTextColor={COLORS.textHint}
                  value={formData[currentStepData.field as keyof typeof formData] as string}
                  onChangeText={(value) => updateFormData(currentStepData.field, value)}
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                />
              </ScrollView>
              
              <View style={styles.buttonContainer}>
                <SquishyButton 
                  onPress={submitForm}
                  variant="primary"
                  size="large"
                  disabled={!formData[currentStepData.field as keyof typeof formData]}
                >
                  {currentStep === steps.length - 1 ? 'Submit SOS' : 'Next'}
                </SquishyButton>
                
                <SquishyButton 
                  onPress={onClose}
                  variant="ghost"
                  size="medium"
                >
                  Cancel
                </SquishyButton>
              </View>
            </SafeAreaView>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.backgroundPrimary}B3`,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  modalCard: {
    flex: 1,
    overflow: 'hidden',
    padding: SPACING.lg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.sm,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textHint,
  },
  activeStepDot: {
    backgroundColor: COLORS.vibrantPink,
    width: 24,
  },
  completedStepDot: {
    backgroundColor: COLORS.success,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: `${COLORS.vibrantPink}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    flex: 1,
  },
  stepHelper: {
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
});
