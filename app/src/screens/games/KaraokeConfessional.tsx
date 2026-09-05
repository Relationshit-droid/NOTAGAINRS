import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function KaraokeConfessional({ navigation }: any) {
    useEffect(() => {
        speakMarcie("Harmonized on 'We don't talk—we just scroll and sigh'? That's not a song—that's a diagnosis.");
    }, []);

    return (
        <ScreenLayout 
            showHeader={false} 
            scrollable={true}
            contentStyle={styles.content}
        >
            <View style={styles.header}>
                <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Typography variant="body">Back</Typography>
                </SquishyButton>
                <Typography variant="h1" style={styles.title}>The Love Arcade</Typography>
            </View>

            <Typography variant="h2" style={styles.subtitle}>
                +100 Games to Deepen Connection
            </Typography>

            <GlassCard style={styles.card}>
                <Typography variant="caption" style={styles.cardLabel}>Type: Auto-lyric rewrite + duet</Typography>
                <Typography variant="body">Mechanics: Pick song → AI rewrites chorus ("Our love's buffering…") → record duet.</Typography>
            </GlassCard>

            <GlassCard style={styles.card}>
                <Typography variant="caption" style={styles.cardLabel}>Scoring</Typography>
                <Typography variant="body">
                    ✅ Recorded = +20{'\n'}
                    ✅ Used vulnerability word = +10
                </Typography>
            </GlassCard>

            <View style={styles.actionArea}>
                <SquishyButton onPress={() => alert('Rewriting Lyrics...')} style={styles.playBtn}>
                    <Typography variant="h2">Pick Song</Typography>
                </SquishyButton>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: SPACING.screenPadding,
        gap: SPACING.large,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.small,
        marginTop: SPACING.xlarge,
    },
    backBtn: {
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
    },
    title: {
        color: COLORS.textPrimary,
        flex: 1,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.medium,
    },
    card: {
        padding: SPACING.cardPadding,
    },
    cardLabel: {
        marginBottom: SPACING.small,
        color: COLORS.textSecondary,
    },
    actionArea: {
        marginTop: SPACING.xxlarge,
        alignItems: 'center',
    },
    playBtn: {
        width: '80%',
        paddingVertical: SPACING.regular,
        backgroundColor: COLORS.emotionalConnection,
        borderRadius: BORDER_RADIUS.xxlarge,
        alignItems: 'center',
    },
});
