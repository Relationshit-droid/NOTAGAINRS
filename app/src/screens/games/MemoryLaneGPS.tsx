import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';
import { speakMarcie } from '../../lib/voice-engine';

export default function MemoryLaneGPS({ navigation }: any) {
    useEffect(() => {
        speakMarcie("Pinned Trader Joe's parking lot? Iconic. Love and frozen dumplings.");
    }, []);

    return (
        <ScreenLayout showMarcie={true} marcieQuote="Pinned Trader Joe's parking lot? Iconic. Love and frozen dumplings." showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton 
                        variant="ghost" 
                        size="small"
                        onPress={() => navigation.goBack()}
                    >
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h2" style={styles.title}>Memory Lane GPS</Typography>
                </View>

                <Typography variant="h1" style={styles.mainTitle}>
                    The Love Arcade
                </Typography>
                <Typography variant="body" style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <GlassCard style={styles.card}>
                    <Typography variant="instructions" style={styles.cardLabel}>
                        Type: Map pin + media proof
                    </Typography>
                    <Typography variant="body">
                        Mechanics: Drop pin → label ("Best fight-turned-hug") → upload one photo both took that day.
                    </Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="instructions" style={styles.cardLabel}>
                        Scoring
                    </Typography>
                    <Typography variant="body">
                        ✅ Pin = +5{'\n'}
                        ✅ Photo = +10{'\n'}
                        ✅ Partner confirms = +10
                    </Typography>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton 
                        variant="primary" 
                        size="large"
                        onPress={() => alert('Opening Map...')}
                    >
                        <Typography variant="button" color={COLORS.textPrimary}>
                            Drop Pin
                        </Typography>
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
        padding: SPACING.lg, 
        gap: SPACING.lg 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.sm, 
        marginTop: SPACING.xl 
    },
    title: { 
        flex: 1,
    },
    mainTitle: {
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: SPACING.lg,
    },
    card: { 
        padding: SPACING.lg 
    },
    cardLabel: {
        marginBottom: SPACING.sm,
    },
    actionArea: { 
        marginTop: SPACING.xl, 
        alignItems: 'center' 
    },
});
