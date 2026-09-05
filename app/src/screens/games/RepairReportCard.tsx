import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function RepairReportCard({ navigation }: any) {
    useEffect(() => {
        speakMarcie("Honesty up 20%? Wow. You actually said 'I was wrong' without vomiting. Growth!");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.title}>The Repair Report Card</Typography>
                </View>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Type: Weekly slider survey</Typography>
                    <Typography variant="body">Mechanics: Rate 5 areas (Listening, Space, Humor, Touch, Honesty).</Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Scoring</Typography>
                    <Typography variant="body">
                        ✅ Improvement vs. last week = +5/area{'\n'}
                        ✅ Honesty +10% = +15
                    </Typography>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Opening Survey...')} style={styles.playBtn}>
                        <Typography variant="h2" color={COLORS.textPrimary}>Start Rate</Typography>
                    </SquishyButton>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    content: { 
        padding: SPACING.screenPadding, 
        gap: SPACING.regular,
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.regular,
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large,
    },
    title: { 
        flex: 1,
    },
    card: { 
        padding: SPACING.cardPadding,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    cardTitle: {
        marginBottom: SPACING.small,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center',
    },
    playBtn: { 
        width: '80%',
    },
});
