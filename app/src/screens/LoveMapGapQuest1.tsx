
import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const LoveMapGapQuest1Screen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Typography variant="header" style={styles.title}>DISCOVERY NEEDED: THE POTTERY VOID</Typography>
                <Typography variant="body" style={styles.subtitle}>PARTNER A: CRAFT A 'CURIOUS QUESTION' TO REVEAL THIS HIDDEN PASSION.</Typography>

                <GlassCard style={styles.mapContainer} variant="default">
                    <View style={styles.crater}>
                        <Typography variant="label" style={styles.craterText}>POTTERY CRATER</Typography>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="TYPE YOUR CURIOUS QUESTION HERE..."
                            placeholderTextColor={COLORS.textSecondary}
                            multiline
                        />
                        <SquishyButton variant="primary" size="medium" onPress={() => {}}>
                            <Typography variant="button" color={COLORS.textPrimary}>DEPLOY BRIDGE</Typography>
                        </SquishyButton>
                    </View>
                </GlassCard>

                <GlassCard style={styles.progressContainer} variant="outlined">
                    <Typography variant="label" style={styles.progressTitle}>MAP PROGRESS</Typography>
                    <View style={styles.progressBarContainer}>
                        <LinearGradient colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.progressBar} />
                    </View>
                    <Typography variant="caption" style={styles.progressText}>2 OF 10 GAP QUEST JOURNEY</Typography>
                </GlassCard>

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: SPACING.screenPadding, alignItems: 'center' },
    title: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.small, 
        textTransform: 'uppercase' 
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge, 
        maxWidth: 300, 
        textTransform: 'uppercase', 
        fontWeight: 'bold' 
    },
    mapContainer: { 
        width: '100%', 
        minHeight: 400, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: SPACING.regular 
    },
    crater: {
        width: 150,
        height: 150,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: 'rgba(252, 12, 132, 0.2)',
        borderWidth: 2,
        borderColor: COLORS.lavenderPurple,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.neonSoft,
        marginBottom: SPACING.xlarge
    },
    craterText: { color: COLORS.vibrantPink },
    inputContainer: { 
        width: '100%', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        borderColor: COLORS.vibrantPink, 
        borderWidth: 1 
    },
    input: { 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.medium, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        minHeight: 100, 
        marginBottom: SPACING.regular, 
        textAlignVertical: 'top', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    progressContainer: { 
        marginTop: SPACING.xlarge, 
        width: '100%',
    },
    progressTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small,
    },
    progressBarContainer: { 
        height: 12, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.large, 
        overflow: 'hidden' 
    },
    progressBar: { width: '20%', height: '100%', borderRadius: BORDER_RADIUS.large },
    progressText: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        marginTop: SPACING.small, 
        fontWeight: 'bold' 
    }
});

export default LoveMapGapQuest1Screen;
