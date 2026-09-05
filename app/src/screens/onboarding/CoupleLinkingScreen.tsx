import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { coupleApi } from '../../lib/api';
import { BlurView } from 'expo-blur';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, RadialGradientBackground, GlassCard } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const CoupleLinkingScreen = () => {
  const [partnerCode, setPartnerCode] = useState('');
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleLinkCouple = async () => {
    if (!partnerCode.trim()) {
      Alert.alert('Error', 'Please enter a partner code');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to link with a partner');
      return;
    }

    try {
      const token = await user.getIdToken();
      const result = await coupleApi.joinCouple(user.uid, partnerCode.toUpperCase(), token);

      Alert.alert(
        'Success!', 
        'You are now linked with your partner!', 
        [
          { text: 'Continue', onPress: () => navigation.navigate('DashboardHome' as never) }
        ]
      );
    } catch (error: any) {
      console.error('Error linking couple:', error);
      Alert.alert('Error', error.message || 'Failed to link with partner. Please try again.');
    }
  };

  const handleGenerateCode = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in first');
      return;
    }
    navigation.navigate('CoupleCode' as never);
  };

  return (
    <ScreenLayout>
      <RadialGradientBackground />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Typography variant="header" style={styles.mainTitle}>Link Your Cosmic Connection</Typography>
          <Typography variant="body" style={styles.subtitle}>Enter your partner's cosmic code to sync your journey.</Typography>

          <GlassCard style={styles.glassPanel}>
            <Typography variant="label" style={styles.inputLabel}>Partner's Cosmic Code</Typography>
            <TextInput
              style={styles.input}
              placeholder="XXXXXX"
              placeholderTextColor={COLORS.textHint}
              value={partnerCode}
              onChangeText={setPartnerCode}
              autoCapitalize="characters"
              maxLength={6}
            />

            <SquishyButton onPress={handleLinkCouple}>
              <Typography variant="button">Link Cosmic Connection</Typography>
            </SquishyButton>

            <SquishyButton 
              variant="secondary"
              onPress={handleGenerateCode}
            >
              <Typography variant="button">Generate My Code</Typography>
            </SquishyButton>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.screenPadding,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: SPACING.small,
    paddingHorizontal: SPACING.regular,
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xxlarge,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundPrimary + '99',
  },
  inputLabel: {
    marginBottom: SPACING.small,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
});

export default CoupleLinkingScreen;