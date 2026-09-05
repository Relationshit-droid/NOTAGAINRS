import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { useGameSession } from '../../hooks';
import { getGameByScreen } from '../../lib/gameRegistry';

const GAME_ID = 'ransom-note';
const CATEGORY_ID = 'creative-chaos';

const wordBank = [
    { text: 'TONIGHT', style: 'ransom' },
    { text: 'PIZZA', style: 'spooky' },
    { text: 'BEHOLD', style: 'marker' },
    { text: 'MY', style: 'ransom' },
    { text: 'ETERNAL', style: 'spooky' },
    { text: 'FEAST', style: 'marker' },
    { text: 'WITH', style: 'ransom' },
    { text: 'YOU', style: 'spooky' },
];

const RansomWord = ({ word, onSelect }: { word: any, onSelect: (word: any) => void }) => (
    <SquishyButton onPress={() => onSelect(word)} style={[styles.clipping, styles[word.style as keyof typeof styles]]}>
        <Typography variant="body" style={styles.clippingText}>{word.text}</Typography>
    </SquishyButton>
);

const TheRansomNoteGame = ({ navigation }: any) => {
    const [note, setNote] = useState<any[]>([]);

    const {
        session,
        loading,
        isSyncing,
        updateScore,
        completeGame,
    } = useGameSession(GAME_ID, CATEGORY_ID);

    const addWordToNote = async (word: any) => {
        setNote([...note, word]);
        // Update score based on progress
        const progress = Math.min(((note.length + 1) / 10) * 100, 100);
        await updateScore(progress);
    };

    const handleClearNote = async () => {
        setNote([]);
        await updateScore(0);
    };

    const handleFinish = async () => {
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {isSyncing && (
                    <View style={styles.syncIndicator}>
                        <ActivityIndicator size="small" color={COLORS.aquaTeal} />
                        <Typography variant="caption" style={styles.syncText}>Syncing...</Typography>
                    </View>
                )}

                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.headerTitle}>The Ransom Note</Typography>
                    <View style={styles.spacer} />
                </View>

                <Typography variant="h2" style={styles.objective}>Invite your partner on a date... or else.</Typography>

                <GlassCard style={styles.canvas}>
                    {note.length > 0 ? (
                        <View style={styles.noteContainer}>
                            {note.map((word, i) => (
                                <View key={i} style={[styles.noteWord, styles[word.style as keyof typeof styles]]}>
                                    <Typography variant="body" style={styles.noteText}>{word.text}</Typography>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Typography variant="body" style={styles.placeholder}>Tap words to add them here</Typography>
                    )}
                </GlassCard>

                <ScrollView horizontal contentContainerStyle={styles.wordBank} showsHorizontalScrollIndicator={false}>
                    {wordBank.map((word, i) => <RansomWord key={i} word={word} onSelect={addWordToNote} />)}
                </ScrollView>

                <SquishyButton onPress={handleClearNote} style={styles.clearBtn} variant="secondary">
                    <Typography variant="body">Clear Note</Typography>
                </SquishyButton>

                {note.length > 0 && (
                    <SquishyButton onPress={handleFinish} style={styles.finishBtn} variant="primary">
                        <Typography variant="body">Finish & Share</Typography>
                    </SquishyButton>
                )}
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        alignItems: 'center',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: SPACING.regular,
    },
    backBtn: {
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    spacer: {
        width: 24,
    },
    objective: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xlarge,
        textAlign: 'center',
    },
    canvas: {
        width: '100%',
        height: 300,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        borderWidth: 8,
        borderColor: COLORS.backgroundSecondary,
        padding: SPACING.regular,
        marginBottom: SPACING.xlarge,
        justifyContent: 'center',
    },
    noteContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.small,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    noteWord: {
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
    },
    noteText: { 
        color: COLORS.backgroundPrimary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    placeholder: { 
        color: COLORS.textHint, 
        fontStyle: 'italic', 
        alignSelf: 'center',
        textAlign: 'center',
    },
    wordBank: { 
        gap: SPACING.regular, 
        paddingVertical: SPACING.regular 
    },
    clipping: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.regular, 
        borderRadius: BORDER_RADIUS.small, 
        elevation: 3,
        marginRight: SPACING.small,
    },
    clippingText: { 
        color: COLORS.backgroundPrimary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    ransom: { 
        backgroundColor: COLORS.textPrimary, 
    },
    marker: { 
        backgroundColor: COLORS.info,
    },
    spooky: { 
        backgroundColor: COLORS.error,
    },
    clearBtn: {
        marginTop: SPACING.xlarge,
        width: '60%',
    },
    finishBtn: {
        marginTop: SPACING.regular,
        width: '60%',
    },
});

export default TheRansomNoteGame;
