
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebaseClient';
import { useAppStore } from '../../state/store';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAdmin = useAppStore((s) => s.setAdmin);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, 'admins', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAdmin(true);
      } else {
        setError('You are not authorized to access the admin portal.');
        auth.signOut();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          Admin Console
        </Typography>
        <GlassCard padding="large" style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.textHint}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.textHint}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? (
            <Typography variant="caption" color={COLORS.error} center style={styles.error}>
              {error}
            </Typography>
          ) : null}
          <SquishyButton
            onPress={handleLogin}
            accessibilityLabel="Authorize Access"
            variant="primary"
            size="large"
            style={styles.button}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Authorize Access
            </Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.healingHospital,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: SPACING.xlarge,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: COLORS.emotionalConnection,
    marginBottom: SPACING.xxlarge,
  },
  formCard: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
    borderRadius: BORDER_RADIUS.input,
    color: COLORS.textPrimary,
    fontFamily: 'Cheese-Regular',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  button: {
    width: '100%',
    marginTop: SPACING.small,
  },
  error: {
    marginBottom: SPACING.regular,
  },
});

export default AdminLoginScreen;
