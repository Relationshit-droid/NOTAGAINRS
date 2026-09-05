
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const PARTNER_A_VALUE = 60;
const TOLERANCE = 10;

const VibeSyncSlider = () => {
    const [userValue, setUserValue] = useState(50);
    const [showResult, setShowResult] = useState(false);

    const isInSync = Math.abs(userValue - PARTNER_A_VALUE) <= TOLERANCE;

    const handleLockIn = () => {
        setShowResult(true);
    };

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <View style={styles.header}>
                <Typography variant="h1" center style={styles.headerTitle}>VIBE SYNC</Typography>
                <Typography variant="label" center color={COLORS.textSecondary} style={styles.headerSubtitle}>
                    ALIGN YOUR ENERGY WITH YOUR PARTNER.
                </Typography>
            </View>

            <View style={styles.gameArea}>
                {/* Partner A (Hidden) */}
                <View style={styles.playerColumn}>
                    <Typography variant="label" color={COLORS.textSecondary} style={styles.playerName}>PARTNER A</Typography>
                    <View style={styles.sliderContainer}>
                        <GlassCard style={styles.shroud}>
                            <Typography style={{fontSize: TYPOGRAPHY.fontSize.displayLarge}}>🔒</Typography>
                            <Typography variant="caption" color={COLORS.textSecondary} style={styles.shroudText}>VALUE HIDDEN</Typography>
                        </GlassCard>
                    </View>
                    <Typography variant="h2">??</Typography>
                </View>

                {/* Sync Indicator */}
                <View style={styles.syncIndicatorColumn}>
                     <GlassCard style={[styles.syncIndicator, showResult && { backgroundColor: isInSync ? COLORS.info : COLORS.vibrantPink}]}>
                        <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>⚡️</Typography>
                    </GlassCard>
                    {showResult && <Typography variant="label" color={isInSync ? COLORS.info : COLORS.vibrantPink}>{isInSync ? 'IN SYNC' : 'MISALIGNED'}</Typography>}
                </View>

                {/* User (Active) */}
                <View style={styles.playerColumn}>
                    <Typography variant="label" color={COLORS.vibrantPink} style={styles.playerName}>YOUR VIBE</Typography>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={{ height: 250, width: 50 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={userValue}
                            onValueChange={setUserValue}
                            minimumTrackTintColor={COLORS.vibrantPink}
                            maximumTrackTintColor={COLORS.borderSubtle}
                            thumbTintColor={COLORS.vibrantPink}
                            inverted
                        />
                    </View>
                    <Typography variant="h2">{Math.round(userValue)}</Typography>
                </View>
            </View>

            <SquishyButton onPress={handleLockIn} style={styles.lockButton}>
                <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>🔄</Typography>
                <Typography variant="button" style={styles.lockButtonText}>LOCK IN SYNC</Typography>
            </SquishyButton>
            {showResult && <Typography variant="caption" color={COLORS.textSecondary} center style={styles.resultDetailText}>PARTNER A'S VALUE WAS {PARTNER_A_VALUE}</Typography>}
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        alignItems: 'center', 
        paddingVertical: SPACING.xlarge 
    },
    headerTitle: { 
        textTransform: 'uppercase' 
    },
    headerSubtitle: { 
        textTransform: 'uppercase',
    },
    gameArea: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        width: '100%', 
        height: 400 
    },
    playerColumn: { 
        alignItems: 'center', 
        height: '100%', 
        justifyContent: 'space-between' 
    },
    playerName: { 
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
    sliderContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: 80 
    },
    shroud: { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    shroudText: { 
        textTransform: 'uppercase',
    },
    syncIndicatorColumn: { 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    syncIndicator: { 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle 
    },
    lockButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.neonSoft,
    },
    lockButtonText: { 
        marginLeft: SPACING.small,
    },
    resultDetailText: { 
        marginTop: SPACING.regular,
        textTransform: 'uppercase',
    }
});

export default VibeSyncSlider;
