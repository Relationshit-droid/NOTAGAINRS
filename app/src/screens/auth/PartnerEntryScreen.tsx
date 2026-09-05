import { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

type PartnerEntryScreenProps = {
  onLinked: (code: string) => void;
};

export default function PartnerEntryScreen({ onLinked }: PartnerEntryScreenProps) {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('Enter your partner\'s code to link');

  const validate = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter a partner code');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setLoading(true);
    setComment('Validating code...');
    try {
      const token = await user.getIdToken();
      const result = await coupleApi.joinCouple(user.uid, code.toUpperCase(), token);
      setComment('Linked! Dr. Marcie approves... for now.');
      setTimeout(() => onLinked(code), 800);
    } catch (e: any) {
      setComment(e.message || 'Code not found. Did you share the right tea?');
      setLoading(false);
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <View style={styles.content}>
        <GlassCard variant="elevated">
          <Typography variant="header">Enter Partner Code</Typography>
          <TextInput 
            value={code} 
            onChangeText={setCode} 
            placeholder="XXXXXX" 
            style={styles.input}
            placeholderTextColor={COLORS.textHint}
            autoCapitalize="characters"
            maxLength={6}
          />
          <Typography variant="marcieDialogue" style={styles.comment}>{comment}</Typography>
        </GlassCard>
        <SquishyButton onPress={validate}>
          {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : <Typography variant="button">Validate</Typography>}
        </SquishyButton>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SPACING.screenPadding,
    justifyContent: 'center',
    gap: SPACING.regular,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary,
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  comment: {
    marginTop: SPACING.regular,
    color: COLORS.textSecondary,
  },
});