
import React from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const ChoiceButton = ({ label, imageUri, color, glowColor, letter }: { label: string; imageUri: string; color: string; glowColor: string; letter: string }) => (
    <SquishyButton variant="ghost" size="large" onPress={() => {}} style={[styles.choiceButton, { borderColor: color, shadowColor: glowColor }]}>
        <ImageBackground source={{ uri: imageUri }} style={styles.choiceImage} imageStyle={{ borderRadius: BORDER_RADIUS.xlarge }}>
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.9)']} style={styles.choiceGradient}>
                <View style={[styles.choiceLetterContainer, { backgroundColor: color }]}>
                    <Typography variant="button" style={styles.choiceLetter}>{letter}</Typography>
                </View>
                <Typography variant="h3" style={styles.choiceLabel}>{label}</Typography>
            </LinearGradient>
        </ImageBackground>
    </SquishyButton>
);

const LoveMapSpeedrunGameScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.timerContainer}>
                    <Typography variant="label" style={styles.timerLabel}>TIME REMAINING</Typography>
                    <View style={styles.timerBarBackground}>
                        <LinearGradient colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.timerBar} />
                    </View>
                </View>

                <Typography variant="gameTitle" style={styles.questionText}>WHAT'S THEIR GO-TO COMFORT SNACK THIS MONTH?</Typography>

                <View style={styles.choicesGrid}>
                    <ChoiceButton letter="A" label="SALT & VINEGAR CHIPS" color={COLORS.vibrantPink} glowColor={COLORS.glowPink} imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAR6eyEJy4q7hAH3icbzu3BtkriNGhKWsR1BUjLTU93nKB7vhaby-U8CT0IoBGaHimsRKPIR9jfh-XDAx7EHb3ghdNVErYPBHPYVR1VFtnF_ZKkSFvV0G4_NoeD94XbPdCO7D6sWn4olDsEuasr7lysqsxqtnZz0zwWzuD_0sthzMtEjJcm2uyDzsd7Cv_MCUeYUPgfRUd5N79pxISeG7MxGWYlJhyA8S6Tm6x9Gi6NYAhx3MDpr8xu8EShdzLEuaoFYAP-zfh5D03_" />
                    <ChoiceButton letter="B" label="DARK CHOCOLATE" color={COLORS.lavenderPurple} glowColor="rgba(161, 107, 242, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCvkMYBCSseWmeW-GCYzIF9TZKJc9F2biyg_4IQGfK7QBAitTvcNkkNQEPXD3H3KqNQbrOpz1ziPBbIvS88nN-QEFaz-MttJpvhmmluT7-n95vlWCsnstVokr-UuvVDMDA7s5hDzJagXNz9ErZWx_WnTmuXmZU_H1LldtKxaTSm4OfwtPkeEilGbZmOBCtxBOsXYnpsfvFq_e5CPlLHDVseqZZfO6gVp5mGpN41naDWQ7kVD_otUCs7j0oEoeIip7yh8fbhKGm49pcS" />
                    <ChoiceButton letter="C" label="SPICY RAMEN" color={COLORS.aquaTeal} glowColor="rgba(0, 212, 170, 0.4)" imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBkzovkATWmPhVDPbsVMAjLEAcszGcG599qhQPr9wlPpMW3FrNdabYYUtfQzTSgsYno3jDjrlx59wSHhCXatBrkCFv9D1HKhb6P1YHpFO8J-JL2XrSPQ-jZmYbV-LxZJs3RoqSPQyHjwGk3e0JMChoaJaWa8PVpx6I_vjfBF-jRwNap9bsnzGYynWG9Vkas-7XO43lxTUrANThvWNoMzgOOSUpt2rInNx_q1_AlDcfezrfosXbr4-0fp5Mn6VILlED4qDOaL-Ldrim4" />
                    <ChoiceButton letter="D" label="GUMMY BEARS" color={COLORS.brightYellow} glowColor={COLORS.glowYellow} imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBrIrOZiJrnO-3GAW2SPs_ShPJ48Y9Y_PdhG4emcbgLxO6RZKBebDr_FSx1gwN6h6r3lLVlsbxklttr7PqAqNaOKkcxxgo8zeE0Kh9W0otz9wvAbNvNfYGRmSf4SbWWUpevt3I0NjhyeEUnKsOv219hR2ndtBMTWdm-BtntrqGLHyEhxxO7zRe4v83gZwhWPL-a8lPfU1mGxVTVFnDteGOnOyJOoCYzcuhl_UkXDhHfeCAEewwKQ2YeEa6tn9U0o57YRBI6j-aooVBX" />
                </View>

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: SPACING.regular },
    timerContainer: { marginBottom: SPACING.xlarge, paddingHorizontal: SPACING.regular },
    timerLabel: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        marginBottom: SPACING.small, 
        fontWeight: 'bold' 
    },
    timerBarBackground: { 
        height: 12, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.large 
    },
    timerBar: { width: '65%', height: '100%', borderRadius: BORDER_RADIUS.large },
    questionText: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge, 
        textTransform: 'uppercase' 
    },
    choicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    choiceButton: { 
        width: '48%', 
        aspectRatio: 1, 
        marginBottom: SPACING.regular, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        borderWidth: 2, 
        ...SHADOWS.medium,
        backgroundColor: COLORS.backgroundInput,
        padding: 0,
    },
    choiceImage: { flex: 1, justifyContent: 'flex-end', width: '100%', height: '100%' },
    choiceGradient: { flex: 1, justifyContent: 'flex-end', padding: SPACING.regular, borderRadius: BORDER_RADIUS.xlarge },
    choiceLetterContainer: { 
        position: 'absolute', 
        top: SPACING.regular, 
        right: SPACING.regular, 
        width: 32, 
        height: 32, 
        borderRadius: BORDER_RADIUS.round, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    choiceLetter: { color: COLORS.backgroundPrimary, fontWeight: 'bold' },
    choiceLabel: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase' 
    },
});

export default LoveMapSpeedrunGameScreen;
