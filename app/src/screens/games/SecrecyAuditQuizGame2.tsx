import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const SecrecyAuditQuizGame2 = () => {
    const [countdown, setCountdown] = useState(5);
    const [latency, setLatency] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        const latencyTimer = setInterval(() => {
            setLatency(prev => prev + 50);
        }, 50);

        return () => {
            clearInterval(timer);
            clearInterval(latencyTimer);
        };
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Typography variant="h2" style={styles.headerText}>SECRECY AUDIT</Typography>
                    <View style={styles.timerContainer}>
                        <Typography variant="h2" style={styles.timerText}>{`0${countdown}`}</Typography>
                    </View>
                    <Typography variant="h2" style={styles.headerText}>SYNC SCORE: 1,240</Typography>
                </View>

                <View style={styles.gameArea}>
                    <View style={styles.hostSection}>
                        <GlassCard style={styles.speechBubble}>
                            <Typography variant="sass">"Hmm, that delay is speaking volumes..."</Typography>
                        </GlassCard>
                    </View>

                    <View style={styles.quizSection}>
                        <GlassCard style={styles.questionCard}>
                            <Typography variant="caption" style={styles.questionLabel}>Question 10 of 10</Typography>
                            <Typography variant="h2" center>Have you ever kept a financial secret from your partner?</Typography>
                        </GlassCard>

                        <GlassCard style={styles.hesitationMeter}>
                            <Typography variant="body" style={styles.hesitationLabel}>Response Latency: {latency}ms</Typography>
                            <View style={styles.meterBar}>
                                <View style={[styles.meterFill, { width: `${(latency / 1000) * 100}%` }]} />
                            </View>
                        </GlassCard>

                        <View style={styles.buttonRow}>
                            <SquishyButton onPress={() => {}} style={styles.trueButton}>
                                <Typography variant="button" style={styles.buttonMainText}>TRUE</Typography>
                            </SquishyButton>
                            <SquishyButton onPress={() => {}} style={styles.falseButton}>
                                <Typography variant="button" style={styles.buttonMainText}>FALSE</Typography>
                            </SquishyButton>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    headerText: { 
        color: COLORS.textPrimary 
    },
    timerContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 4, 
        borderColor: COLORS.error, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    timerText: { 
        color: COLORS.error 
    },
    gameArea: { 
        flexDirection: 'row', 
        flex: 1, 
        gap: SPACING.regular 
    },
    hostSection: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    speechBubble: { 
        padding: SPACING.regular 
    },
    quizSection: { 
        flex: 2, 
        justifyContent: 'center' 
    },
    questionCard: { 
        padding: SPACING.xlarge, 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    questionLabel: { 
        color: COLORS.error, 
        marginBottom: SPACING.small 
    },
    hesitationMeter: { 
        marginBottom: SPACING.xlarge, 
        padding: SPACING.regular 
    },
    hesitationLabel: { 
        color: COLORS.warmOrange, 
        marginBottom: SPACING.small 
    },
    meterBar: { 
        height: 10, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.small 
    },
    meterFill: { 
        height: '100%', 
        backgroundColor: COLORS.warmOrange, 
        borderRadius: BORDER_RADIUS.small 
    },
    buttonRow: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    trueButton: { 
        flex: 1, 
        height: 80, 
        backgroundColor: COLORS.error, 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    falseButton: { 
        flex: 1, 
        height: 80, 
        backgroundColor: COLORS.blushPink, 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    buttonMainText: { 
        color: COLORS.textPrimary 
    },
});

export default SecrecyAuditQuizGame2;
