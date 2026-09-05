import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function GifTheFeels({ navigation }: any) {
    useEffect(() => {
        speakMarcie("You chose Distracted Boyfriend but swapped him for 'Me ignoring my boundaries'? I respect it.");
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
                <Typography variant="caption" style={styles.cardLabel}>Type: Giphy integration</Typography>
                <Typography variant="body">Mechanics: Prompt: "My face when you actually listen." Submit best GIF.</Typography>
            </GlassCard>

            <GlassCard style={styles.card}>
                <Typography variant="caption" style={styles.cardLabel}>Scoring</Typography>
                <Typography variant="body">
                    ✅ Marcie picks "Most Relatable" = +15{'\n'}
                    ✅ "Most Extra" = +10
                </Typography>
            </GlassCard>

            <View style={styles.actionArea}>
                <SquishyButton onPress={() => alert('Opening Giphy...')} style={styles.playBtn}>
                    <Typography variant="h2">Search GIFs</Typography>
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
