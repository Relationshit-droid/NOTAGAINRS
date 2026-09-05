import { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { ScreenLayout } from '../../layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    console.log('Signing in with:', { email, password });
    navigation.navigate('MainGameLibrary');
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="header" style={styles.title}>Welcome Back</Typography>
            <Typography variant="body" style={styles.subtitle}>Sign in to continue your journey</Typography>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Typography variant="label" style={styles.inputLabel}>EMAIL ADDRESS</Typography>
              <TextInput
                style={styles.textInput}
                placeholder="commander@nebula.space"
                placeholderTextColor={COLORS.textHint}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="label" style={styles.inputLabel}>PASSWORD</Typography>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••••••"
                placeholderTextColor={COLORS.textHint}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.rememberContainer}>
              <SquishyButton 
                onPress={() => setRememberMe(!rememberMe)}
                variant="secondary"
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Typography variant="caption" style={styles.checkmark}>✓</Typography>}
                  </View>
                  <Typography variant="caption" style={styles.checkboxLabel}>Remember me</Typography>
                </View>
              </SquishyButton>
              
              <SquishyButton onPress={() => navigation.navigate('PasswordReset')} variant="secondary">
                <Typography variant="caption" style={styles.forgotPassword}>Forgot Password?</Typography>
              </SquishyButton>
            </View>

            <SquishyButton 
              onPress={handleSignIn}
              disabled={!email || !password}
            >
              <Typography variant="button">Sign In</Typography>
            </SquishyButton>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Typography variant="caption" style={styles.dividerText}>OR</Typography>
              <View style={styles.dividerLine} />
            </View>

            <SquishyButton 
              onPress={() => navigation.navigate('LoginAndSignUp')}
              variant="secondary"
            >
              <Typography variant="button">Create Account</Typography>
            </SquishyButton>
          </GlassCard>

          <View style={styles.footer}>
            <SquishyButton onPress={() => navigation.navigate('LegalDisclaimer')} variant="secondary">
              <Typography variant="caption" style={styles.footerLink}>Legal Disclaimer</Typography>
            </SquishyButton>
            <Typography variant="caption" style={styles.footerText}>© 2026 RELATIONSHIT!</Typography>
            <SquishyButton onPress={() => navigation.navigate('HelpAndFaq')} variant="secondary">
              <Typography variant="caption" style={styles.footerLink}>Help & FAQ</Typography>
            </SquishyButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

import { RadialGradientBackground } from '../../components/ui';

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxlarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    marginTop: SPACING.xlarge,
  },
  title: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  formCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  inputGroup: {
    marginBottom: SPACING.large,
  },
  inputLabel: {
    marginBottom: SPACING.small,
  },
  textInput: {
    backgroundColor: COLORS.backgroundInput,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.small,
  },
  checkboxChecked: {
    backgroundColor: COLORS.vibrantPink,
    borderColor: COLORS.vibrantPink,
  },
  checkmark: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: COLORS.textSecondary,
  },
  forgotPassword: {
    color: COLORS.aquaTeal,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.large,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    marginHorizontal: SPACING.regular,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.large,
  },
  footerLink: {
    color: COLORS.aquaTeal,
  },
  footerText: {
    color: COLORS.textSecondary,
  },
});
