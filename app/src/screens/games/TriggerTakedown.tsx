import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, GRADIENTS } from '../../theme';

export default function TriggerTakedown({ navigation }: any) {
    useEffect(() => {
        speakMarcie("You neutralized 'that hotel logo' with a glitter bomb. Still shaky? Tap 'Breathe'—I'll time you.");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundPrimary]} style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.header}>
                            <SquishyButton 
                                onPress={() => navigation.goBack()} 
                                variant="ghost"
                                size="small"
                            >
                                <Typography variant="body">Back</Typography>
                            </SquishyButton>
                            <Typography variant="h1" style={styles.title}>
                                The Love Arcade
                            </Typography>
                        </View>

                        <Typography variant="h2" center style={styles.subtitle}>
                            +100 Games to Deepen Connection
                        </Typography>

                        <GlassCard style={styles.card}>
                            <Typography variant="h3" style={styles.cardTitle}>
                                Trigger Takedown (AR)
                            </Typography>
                            <Typography variant="instructions" style={styles.cardInstruction}>
                                Type: Async AR interaction
                            </Typography>
                            <Typography variant="body">
                                Mechanics: Camera → point at object/song → "squash" trigger → select grounding (Breathe/Tap/Share).
                            </Typography>
                        </GlassCard>

                        <GlassCard style={styles.card}>
                            <Typography variant="h3" style={styles.cardTitle}>
                                Scoring
                            </Typography>
                            <Typography variant="body">
                                ✅ Trigger tagged = +5{'\n'}
                                ✅ Grounding completed = +10{'\n'}
                                ✅ Shared with partner = +5
                            </Typography>
                        </GlassCard>

                        <View style={styles.actionArea}>
                            <SquishyButton 
                                onPress={() => alert('Opening AR Camera...')} 
                                size="large"
                            >
                                <Typography variant="h3">Open AR Camera</Typography>
                            </SquishyButton>
                        </View>
                    </ScrollView>
                </LinearGradient>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic 
    },
    container: { 
        flex: 1 
    },
    content: { 
        padding: SPACING.screenPadding, 
        gap: SPACING.xlarge 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.regular, 
        marginTop: SPACING.xlarge 
    },
    title: { 
        flex: 1,
        textAlign: 'center'
    },
    subtitle: { 
        marginBottom: SPACING.large 
    },
    card: { 
        padding: SPACING.xlarge 
    },
    cardTitle: {
        marginBottom: SPACING.regular,
    },
    cardInstruction: {
        marginBottom: SPACING.regular,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center' 
    },
});
