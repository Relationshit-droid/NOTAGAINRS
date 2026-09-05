import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const SecrecyAuditQuizGame1 = () => {
    const [timer, setTimer] = useState(3);
    const [hesitation, setHesitation] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleAnswer = () => {
        if (timer < 2) {
            setHesitation(true);
        }
    };

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <View style={styles.container}>
                <View style={styles.sideBar}>
                    <Typography variant="h3" center style={styles.sideBarTitle}>Dr. Marcie Liss</Typography>
                    <View style={styles.truthDetector}>
                        <Typography variant="caption" style={styles.truthDetectorLabel}>Truth Detector</Typography>
                        <Typography variant="body" style={styles.truthDetectorStatus}>Watching...</Typography>
                    </View>
                </View>
                <View style={styles.mainContent}>
                    <Typography variant="h1" center style={styles.header}>SECRECY AUDIT</Typography>
                    <GlassCard style={[styles.questionCard, hesitation && styles.hesitationFlash]}>
                        <View style={styles.timerCircle}>
                            <Typography variant="h2" style={styles.timerText}>{`0${timer}`}</Typography>
                        </View>
                        <Typography variant="h2" center style={styles.questionText}>Have you ever kept a significant financial purchase hidden from your partner to avoid conflict?</Typography>
                        <View style={styles.buttonContainer}>
                            <SquishyButton onPress={handleAnswer} style={styles.trueButton}>
                                <MaterialIcons name="check-circle" size={32} color={COLORS.textPrimary} />
                                <Typography variant="button" style={styles.buttonText}>TRUE</Typography>
                            </SquishyButton>
                            <SquishyButton onPress={handleAnswer} style={styles.falseButton}>
                                <MaterialIcons name="cancel" size={32} color={COLORS.textPrimary} />
                                <Typography variant="button" style={styles.buttonText}>FALSE</Typography>
                            </SquishyButton>
                        </View>
                        {hesitation && <Typography variant="caption" center style={styles.hesitationText}>Hesitation Detected</Typography>}
                    </GlassCard>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: 'row' 
    },
    sideBar: { 
        width: 100, 
        backgroundColor: COLORS.backgroundCard, 
        padding: SPACING.regular, 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    sideBarTitle: { 
        color: COLORS.textPrimary 
    },
    truthDetector: { 
        alignItems: 'center' 
    },
    truthDetectorLabel: { 
        color: COLORS.textHint 
    },
    truthDetectorStatus: { 
        color: COLORS.warning 
    },
    mainContent: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: SPACING.xlarge 
    },
    header: { 
        marginBottom: SPACING.xlarge 
    },
    questionCard: { 
        padding: SPACING.xlarge, 
        alignItems: 'center' 
    },
    hesitationFlash: { 
        borderColor: COLORS.warning, 
        borderWidth: 2 
    },
    timerCircle: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 4, 
        borderColor: COLORS.error, 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'absolute', 
        top: SPACING.regular, 
        right: SPACING.regular 
    },
    timerText: { 
        color: COLORS.textPrimary 
    },
    questionText: { 
        marginVertical: SPACING.xxlarge 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    trueButton: { 
        flex: 1, 
        height: 100, 
        backgroundColor: COLORS.error, 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: SPACING.small 
    },
    falseButton: { 
        flex: 1, 
        height: 100, 
        backgroundColor: COLORS.emotionalConnection, 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: SPACING.small 
    },
    buttonText: { 
        color: COLORS.textPrimary 
    },
    hesitationText: { 
        color: COLORS.warning, 
        marginTop: SPACING.regular 
    },
});

export default SecrecyAuditQuizGame1;
