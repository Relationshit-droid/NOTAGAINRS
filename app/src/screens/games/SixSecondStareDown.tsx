import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function SixSecondStareDown({ navigation }: any) {
    useEffect(() => {
        speakMarcie("2.3 seconds before laughing? Adorable. Try again—no smiling. (…liar.)");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.title}>Six-Second Stare-Down</Typography>
                </View>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Type: Real-time camera sync</Typography>
                    <Typography variant="body">Mechanics: Front cams → AI detects mutual gaze → 6-sec timer.</Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Scoring</Typography>
                    <Typography variant="body">
                        ✅ 6 sec eye contact = +25{'\n'}
                        ✅ Sync blink (±0.5s) = +10
                    </Typography>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Starting Gaze Detection...')} style={styles.playBtn}>
                        <Typography variant="h2" color={COLORS.textPrimary}>Start Detection</Typography>
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
        gap: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.regular 
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large 
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
        marginBottom: SPACING.small
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center' 
    },
    playBtn: { 
        width: '80%',
    },
});
