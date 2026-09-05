import { useState } from 'react';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { GlassCard, Typography, SquishyButton, RadialGradientBackground } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import * as Haptics from '../../utils/haptics';
import { resetPassword } from '../../lib/supabase';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

type Props = {
  onSent?: () => void;
};

export default function PasswordResetScreen({ onSent }: Props) {
  const navigation = useAppNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setError(null);
    try {
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      await resetPassword(email, typeof window !== 'undefined' ? window.location.origin : undefined);
      Haptics.selectionAsync();
      (onSent ? onSent() : navigation.goBack());
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <RadialGradientBackground />
      <View style={styles.content}>
        <GlassCard variant="elevated">
          <Typography variant="header">Reset Your Password</Typography>
          <Typography variant="body" style={styles.description}>Enter your email and we'll send you a reset link.</Typography>
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            placeholder="you@example.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            style={styles.input} 
            placeholderTextColor={COLORS.textHint}
          />
          {error && <Typography variant="marcieDialogue" style={styles.error}>{error}</Typography>}
          <SquishyButton onPress={send}>
            {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : <Typography variant="button">Send Reset Link</Typography>}
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SPACING.screenPadding,
    justifyContent: 'center',
  },
  description: {
    marginTop: SPACING.small,
    marginBottom: SPACING.large,
    color: COLORS.textSecondary,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary,
    marginBottom: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.regular,
  },
});
