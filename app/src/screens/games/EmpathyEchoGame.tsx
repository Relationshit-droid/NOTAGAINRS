import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const WaveformBar = ({ height, color }: { height: number, color: string }) => (
    <View style={[styles.waveformBar, { height, backgroundColor: color }]} />
);

const EmpathyEchoGameScreen = () => {
    const partnerAWave = [8, 12, 20, 32, 24, 40, 28, 16, 36, 20, 12, 8];
    const partnerBWave = [10, 24, 48, 32, 20, 40, 16];

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Typography variant="h1" center>The Love Arcade</Typography>
                        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
                    </View>

                    <View style={styles.gameLayout}>
                        {/* Partner A Panel */}
                        <GlassCard style={styles.partnerPanel}>
                            <Typography variant="h3">Partner A's Heart</Typography>
                            <View style={styles.waveformContainer}>
                                {partnerAWave.map((h, i) => <WaveformBar key={i} height={h * 2} color={COLORS.mintGreen} />)}
                            </View>
                            <SquishyButton variant="secondary" onPress={() => {}}>
                                <Typography variant="button">Play</Typography>
                            </SquishyButton>
                        </GlassCard>

                        {/* Partner B Panel */}
                        <GlassCard style={[styles.partnerPanel, styles.partnerPanelActive]}>
                            <Typography variant="h3">Your Echo</Typography>
                            <View style={styles.waveformContainer}>
                                {partnerBWave.map((h, i) => <WaveformBar key={i} height={h * 1.5} color={COLORS.lavenderPurple} />)}
                            </View>
                            <SquishyButton variant="secondary" onPress={() => {}}>
                                <Typography variant="button">Stop</Typography>
                            </SquishyButton>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.gaugeContainer}>
                        <Typography variant="h2" center>Empathy Score: 72</Typography>
                        <Typography variant="body" center style={styles.gaugeFeedback}>"You're drifting toward 'fixing'. Try acknowledging the feeling without offering a solution yet."</Typography>
                        <View style={styles.buttonRow}>
                            <SquishyButton variant="ghost" onPress={() => {}} style={styles.actionButton}>
                                <Typography variant="button">Try Again</Typography>
                            </SquishyButton>
                            <SquishyButton onPress={() => {}} style={styles.actionButton}>
                                <Typography variant="button">Submit Echo</Typography>
                            </SquishyButton>
                        </View>
                    </GlassCard>
                </ScrollView>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    waveformBar: {
        width: 4,
        borderRadius: BORDER_RADIUS.small,
        marginHorizontal: 2,
    },
    partnerPanelActive: {
        borderColor: COLORS.softViolet,
    },
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    scrollContainer: { 
        padding: SPACING.screenPadding 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    gameLayout: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xlarge 
    },
    partnerPanel: { 
        flex: 1,
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle
    },
    waveformContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 150, 
        marginVertical: SPACING.regular 
    },
    gaugeContainer: { 
        alignItems: 'center' 
    },
    gaugeFeedback: { 
        marginVertical: SPACING.regular,
        fontStyle: 'italic'
    },
    buttonRow: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginTop: SPACING.regular,
        width: '100%'
    },
    actionButton: { 
        flex: 1 
    },
});

export default EmpathyEchoGameScreen;
