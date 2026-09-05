import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameSession } from '../../hooks';
import { getGameByScreen } from '../../lib/gameRegistry';

const GAME_ID = 'tone-shift';
const CATEGORY_ID = 'conflict-resolution';

const tones = [
    { name: 'Sarcastic', icon: 'sentiment_dissatisfied' as const },
    { name: 'Anxious', icon: 'psychology' as const },
    { name: 'Warm', icon: 'favorite' as const },
    { name: 'Playful', icon: 'celebration' as const },
];

const ToneButton = ({ 
    tone, 
    selected, 
    onPress 
}: { 
    tone: typeof tones[0], 
    selected: boolean, 
    onPress: () => void 
}) => (
    <GlassCard 
        onPress={onPress} 
        style={[styles.toneButton, selected && styles.selectedToneButton]}
        variant={selected ? 'default' : 'outlined'}
    >
        <MaterialIcons name={tone.icon} size={30} color={selected ? COLORS.textPrimary : COLORS.textSecondary} />
        <Typography variant="body" style={[styles.toneText, selected && styles.selectedToneText]}>{tone.name}</Typography>
    </GlassCard>
);

const ToneShiftChallengeGame = ({ navigation }: any) => {
    const [selectedTone, setSelectedTone] = useState('Anxious');
    const [isRecording, setIsRecording] = useState(false);
    const vocalWarmth = 65;

    const {
        session,
        loading,
        isSyncing,
        updateScore,
        completeGame,
    } = useGameSession(GAME_ID, CATEGORY_ID);

    const handleToneSelect = async (tone: string) => {
        setSelectedTone(tone);
        // Update score based on tone selection
        await updateScore(25);
    };

    const handleStartRecording = async () => {
        setIsRecording(true);
        await updateScore(50);
    };

    const handleComplete = async () => {
        setIsRecording(false);
        await completeGame();
        navigation?.goBack?.();
    };

    if (loading) {
        return (
            <ScreenLayout showHeader={false}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.aquaTeal} />
                    <Typography variant="body" style={styles.loadingText}>
                        Loading game session...
                    </Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.deepCosmic]} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {isSyncing && (
                        <View style={styles.syncIndicator}>
                            <ActivityIndicator size="small" color={COLORS.aquaTeal} />
                            <Typography variant="caption" style={styles.syncText}>Syncing...</Typography>
                        </View>
                    )}

                    <View style={styles.header}>
                        <Typography variant="h1" center>"We need to talk"</Typography>
                        <Typography variant="body" center style={styles.headerSubtitle}>
                            Select a tone and say it like you mean it!
                        </Typography>
                    </View>

                    <View style={styles.mainContent}>
                        {/* Right Sidebar Content */}
                        <GlassCard style={styles.rightSidebar} variant="elevated">
                            <Typography variant="caption" style={styles.sidebarTitle}>Vocal Warmth</Typography>
                            <View style={styles.thermometerContainer}>
                                <View style={styles.thermometer}>
                                    <LinearGradient 
                                        colors={[COLORS.aquaTeal, COLORS.vibrantPink, COLORS.lavenderPurple]}
                                        style={[styles.thermometerFill, { height: `${vocalWarmth}%` }]}
                                    />
                                </View>
                            </View>
                            <Typography variant="h2" style={styles.scoreText}>{vocalWarmth}%</Typography>
                        </GlassCard>
                        
                        <GlassCard style={styles.challengeArea} variant="elevated">
                            <View style={styles.toneGrid}>
                                {tones.map((tone) => (
                                    <ToneButton
                                        key={tone.name}
                                        tone={tone}
                                        selected={selectedTone === tone.name}
                                        onPress={() => handleToneSelect(tone.name)}
                                    />
                                ))}
                            </View>

                            <SquishyButton 
                                onPress={isRecording ? handleComplete : handleStartRecording} 
                                size="large" 
                                style={styles.recordButton}
                                variant={isRecording ? 'primary' : 'secondary'}
                            >
                                <MaterialIcons name={isRecording ? "stop" : "mic"} size={24} color={COLORS.textPrimary} />
                                <Typography variant="button">
                                    {isRecording ? 'STOP & COMPLETE' : 'START RECORDING'}
                                </Typography>
                            </SquishyButton>
                        </GlassCard>
                    </View>
                    
                    <GlassCard style={styles.verdictCard} variant="outlined">
                        <Typography variant="caption" style={styles.verdictTitle}>MARCIE'S VERDICT</Typography>
                        <Typography variant="body" center style={styles.verdictText}>
                            "You sound like a microwave, honey. Add some soul to that sentence!"
                        </Typography>
                    </GlassCard>
                </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    scrollView: { 
        padding: SPACING.regular 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.regular,
        color: COLORS.textSecondary,
    },
    syncIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: SPACING.small,
        padding: SPACING.small,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.medium,
    },
    syncText: {
        marginLeft: SPACING.small,
        color: COLORS.textSecondary,
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.small 
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xlarge 
    },
    challengeArea: { 
        flex: 1, 
        justifyContent: 'space-between', 
        padding: SPACING.regular,
    },
    rightSidebar: { 
        width: 80, 
        alignItems: 'center', 
        padding: SPACING.small,
    },
    sidebarTitle: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase',
        marginBottom: SPACING.small,
    },
    thermometerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    thermometer: { 
        width: 30, 
        height: '80%', 
        backgroundColor: COLORS.backgroundCard, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'flex-end', 
        overflow: 'hidden' 
    },
    thermometerFill: { 
        width: '100%', 
        borderRadius: BORDER_RADIUS.round 
    },
    scoreText: { 
        color: COLORS.vibrantPink, 
        marginTop: SPACING.small 
    },
    toneGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: SPACING.small, 
        marginBottom: SPACING.large 
    },
    toneButton: { 
        width: '47%', 
        aspectRatio: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: SPACING.small 
    },
    selectedToneButton: { 
        backgroundColor: 'rgba(127,19,236,0.2)', 
        borderColor: COLORS.lavenderPurple 
    },
    toneText: { 
        color: COLORS.textSecondary 
    },
    selectedToneText: { 
        color: COLORS.textPrimary 
    },
    recordButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: SPACING.regular 
    },
    verdictCard: { 
        backgroundColor: 'rgba(252, 12, 132, 0.1)', 
        borderColor: 'rgba(252, 12, 132, 0.3)', 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    verdictTitle: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase', 
        letterSpacing: 1, 
        marginBottom: SPACING.small 
    },
    verdictText: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic', 
        textAlign: 'center' 
    }
});

export default ToneShiftChallengeGame;
