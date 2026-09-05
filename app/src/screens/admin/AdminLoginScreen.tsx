
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const AdminLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Placeholder for admin authentication
    if (username === 'admin' && password === 'password') {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Authentication Failed', 'Invalid username or password.');
    }
  };

  return (
    <ScreenLayout scrollable={false} showHeader={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.container}>
          <View style={styles.header}>
            <Typography variant="header" style={styles.headerText}>Love Actually... The Game</Typography>
          </View>
          <View style={styles.content}>
            <Typography variant="gameTitle" style={styles.title}>Admin Console</Typography>
            <Typography variant="body" style={styles.subtitle}>Secure access for game coordinators and moderators</Typography>

            <GlassCard style={styles.glassPanel}>
              <Typography variant="label" style={styles.inputLabel}>Administrator Username</Typography>
              <TextInput
                style={styles.input}
                placeholder="e.g. coordinator_alpha"
                placeholderTextColor={COLORS.textDisabled}
                value={username}
                onChangeText={setUsername}
              />

              <Typography variant="label" style={styles.inputLabel}>Access Security Key</Typography>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor={COLORS.textDisabled}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <SquishyButton onPress={handleLogin}>
                <Typography variant="button">Authorize Access</Typography>
              </SquishyButton>
            </GlassCard>
          </View>
          <View style={styles.footer}>
            <Typography variant="caption" style={styles.footerText}>© 2024 Love Actually... Cosmic Entertainment. All rights reserved.</Typography>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.headerMedium,
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.regular,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    marginBottom: SPACING.xlarge,
  },
  glassPanel: {
    width: '100%',
    maxWidth: 480,
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.xxlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.bodyMedium,
    marginBottom: SPACING.small,
  },
  input: {
    height: 56,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    marginBottom: SPACING.xlarge,
  },
  footer: {
    padding: SPACING.regular,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  footerText: {
    color: COLORS.textHint,
    fontSize: TYPOGRAPHY.fontSize.bodySmall,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
});

export default AdminLoginScreen;
