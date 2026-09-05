
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const Dice = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
    <GlassCard style={styles.dice} variant="default">
        <Typography variant="h1" style={styles.diceIcon}>{icon}</Typography>
        <Typography variant="gameTitle" style={styles.diceValue}>{value}</Typography>
        <Typography variant="label" style={styles.diceTitle}>{title}</Typography>
    </GlassCard>
);

const LegacyDiceGameScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Typography variant="gameTitle" style={styles.title}>LEGACY DICE ARENA</Typography>
                <Typography variant="body" style={styles.subtitle}>Roll your future. Record your legacy.</Typography>

                <View style={styles.diceContainer}>
                    <Dice title="CHILDREN" value="3" icon="👶"/>
                    <Dice title="GOLDEN RETRIEVERS" value="2" icon="🐶"/>
                    <Dice title="LOYALTY SCORE" value="88%" icon="💖"/>
                </View>

                <SquishyButton variant="primary" size="large" onPress={() => {}}>
                    <Typography variant="button" color={COLORS.textPrimary}>RECORD LEGACY</Typography>
                </SquishyButton>
                
                {/* Waveform visualization would go here */}

            </ScrollView>
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
    diceContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        marginBottom: SPACING.xlarge, 
        gap: SPACING.regular 
    },
    dice: {
        minWidth: 120,
        flex: 1,
        alignItems: 'center',
    },
    diceIcon: { fontSize: TYPOGRAPHY.fontSize.displayLarge },
    diceValue: { 
        color: COLORS.textPrimary,
        marginVertical: SPACING.small,
    },
    diceTitle: { 
        color: COLORS.vibrantPink,
    },
});

export default LegacyDiceGameScreen;
