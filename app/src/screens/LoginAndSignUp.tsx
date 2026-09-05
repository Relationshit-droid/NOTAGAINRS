import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';

const LoginAndSignUpScreen = ({ navigation }: any) => {
    const [authMode, setAuthMode] = useState<'Login' | 'SignUp'>('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert('Login Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert('Sign Up Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (authMode === 'Login') {
            handleLogin();
        } else {
            handleSignUp();
        }
    };

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <View style={styles.scrollContent}>
                <Typography variant="gameTitle" style={styles.title}>NAVIGATE THE STARS OF YOUR RELATIONSHIP.</Typography>
                <Typography variant="body" style={styles.subtitle}>Sync your frequencies to begin the journey.</Typography>

                <GlassCard style={styles.glassPanel} variant="default">
                    <View style={styles.toggleContainer}>
                        <SquishyButton 
                            variant={authMode === 'Login' ? 'primary' : 'ghost'}
                            size="medium"
                            onPress={() => setAuthMode('Login')}
                            disabled={loading}
                            style={styles.toggleButton}
                        >
                            <Typography variant="button">LOGIN</Typography>
                        </SquishyButton>
                        <SquishyButton 
                            variant={authMode === 'SignUp' ? 'primary' : 'ghost'}
                            size="medium"
                            onPress={() => setAuthMode('SignUp')}
                            disabled={loading}
                            style={styles.toggleButton}
                        >
                            <Typography variant="button">SIGN UP</Typography>
                        </SquishyButton>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="YOUR COSMIC HANDLE (EMAIL)"
                        placeholderTextColor={COLORS.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="SECRET FREQUENCY (PASSWORD)"
                        placeholderTextColor={COLORS.textSecondary}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        editable={!loading}
                    />

                    <SquishyButton 
                        variant="primary"
                        size="large"
                        onPress={handleSubmit}
                        disabled={loading}
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    >
                        <Typography variant="button" color={COLORS.textPrimary}>
                            {loading ? 'CONNECTING...' : authMode === 'Login' ? 'INITIATE CONNECTION' : 'CREATE ACCOUNT'}
                        </Typography>
                    </SquishyButton>

                    <Typography variant="label" style={styles.dividerText}>OR BRIDGE VIA</Typography>

                    <View style={styles.socialContainer}>
                        <SquishyButton variant="secondary" size="medium" onPress={() => {}} disabled={loading} style={styles.socialButton}>
                            <Typography variant="button" style={[styles.socialButtonText, {color: COLORS.warmOrange}]}>APPLE</Typography>
                        </SquishyButton>
                        <SquishyButton variant="secondary" size="medium" onPress={() => {}} disabled={loading} style={styles.socialButton}>
                            <Typography variant="button" style={[styles.socialButtonText, {color: COLORS.aquaTeal}]}>GOOGLE</Typography>
                        </SquishyButton>
                        <SquishyButton variant="secondary" size="medium" onPress={() => {}} disabled={loading} style={styles.socialButton}>
                            <Typography variant="button" style={[styles.socialButtonText, {color: COLORS.vibrantPink}]}>EMAIL</Typography>
                        </SquishyButton>
                    </View>
                </GlassCard>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { alignItems: 'center', padding: SPACING.screenPadding },
    title: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.tiny, 
        textTransform: 'uppercase' 
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge 
    },
    glassPanel: { 
        width: '100%', 
        maxWidth: 480,
        padding: SPACING.screenPadding,
    },
    toggleContainer: { 
        flexDirection: 'row', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.xxlarge, 
        padding: SPACING.tiny, 
        marginBottom: SPACING.xlarge 
    },
    toggleButton: { flex: 1 },
    input: { 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    submitButton: { 
        marginTop: SPACING.small,
        ...SHADOWS.buttonGlow
    },
    submitButtonDisabled: { 
        opacity: 0.7 
    },
    dividerText: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginVertical: SPACING.xlarge,
    },
    socialContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        gap: SPACING.small 
    },
    socialButton: { 
        flex: 1,
    },
    socialButtonText: { 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    }
});

export default LoginAndSignUpScreen;
