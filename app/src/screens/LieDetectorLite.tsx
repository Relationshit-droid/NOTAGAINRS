import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, GLOWS, moderateScale } from '../theme';

const LieDetectorLiteScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient 
                colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} 
                style={styles.background} 
            />
            
            <View style={styles.header}>
                <Typography variant="gameTitle" style={styles.headerTitle}>LIE DETECTOR: LITE™</Typography>
            </View>

            <View style={styles.mainContent}>
                <Typography variant="header" style={styles.analysisTitle}>VOICE ANALYSIS PROTOCOL</Typography>
                
                <GlassCard style={styles.panel} variant="elevated">
                    <View style={styles.meterContainer}>
                        <Typography variant="button" style={styles.meterTitle}>PROSODY METER</Typography>
                        <Typography variant="gameTitle" style={styles.meterValue}>65%</Typography>
                    </View>
                    <View style={styles.meterBarContainer}>
                        <LinearGradient 
                            colors={[COLORS.vibrantPink, COLORS.softViolet]} 
                            start={{x:0, y:0}} 
                            end={{x:1, y:0}} 
                            style={[styles.meterBar, {width: '65%'}]} 
                        />
                    </View>
                    <Typography variant="marcieDialogue" style={styles.meterStatus}>HIGH PITCH VARIANCE DETECTED</Typography>

                    <SquishyButton 
                        variant="primary" 
                        size="large" 
                        onPress={() => {}}
                        style={styles.recordButton}
                    >
                        <Typography variant="button" color={COLORS.textPrimary} style={styles.recordButtonText}>RECORD</Typography>
                    </SquishyButton>
                    <Typography variant="caption" style={styles.recordSubtext}>HOLD TO ANALYZE VERBAL TRANSPARENCY</Typography>
                </GlassCard>
            </View>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    header: { 
        padding: SPACING.xl, 
        borderBottomWidth: 1, 
        borderColor: COLORS.vibrantPink, 
        backgroundColor: COLORS.richPlum 
    },
    headerTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    mainContent: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: SPACING.xxlarge 
    },
    analysisTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.xxlarge, 
        textTransform: 'uppercase' 
    },
    panel: { 
        padding: SPACING.xxlarge, 
        width: '90%', 
        alignItems: 'center',
        ...GLOWS.soft(COLORS.vibrantPink)
    },
    meterContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginBottom: SPACING.sm 
    },
    meterTitle: { 
        color: COLORS.aquaTeal, 
        textTransform: 'uppercase' 
    },
    meterValue: { 
        color: COLORS.aquaTeal 
    },
    meterBarContainer: { 
        width: '100%', 
        height: SPACING.medium * 3, 
        backgroundColor: COLORS.nightSky, 
        borderRadius: BORDER_RADIUS.small, 
        padding: SPACING.xs, 
        borderWidth: 1, 
        borderColor: COLORS.vibrantPink 
    },
    meterBar: { 
        height: '100%', 
        borderRadius: BORDER_RADIUS.small 
    },
    meterStatus: { 
        color: COLORS.aquaTeal, 
        marginTop: SPACING.sm, 
        textTransform: 'uppercase' 
    },
    recordButton: { 
        width: Math.max(moderateScale(180), 180), 
        height: Math.max(moderateScale(180), 180), 
        borderRadius: Math.max(moderateScale(90), 90), 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginVertical: SPACING.xxlarge,
        ...GLOWS.strong(COLORS.vibrantPink)
    },
    recordButtonText: { 
        color: COLORS.textPrimary, 
        letterSpacing: 4 
    },
    recordSubtext: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        letterSpacing: 2, 
        textAlign: 'center' 
    }
});

export default LieDetectorLiteScreen;
