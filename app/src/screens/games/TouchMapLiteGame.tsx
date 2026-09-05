import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameSession } from '../../hooks';
import { getGameByScreen } from '../../lib/gameRegistry';

const GAME_ID = 'touch-map';
const CATEGORY_ID = 'romance-hub';

const BodyPart = ({ 
    part, 
    color, 
    onPress 
}: { 
    part: string, 
    color: string, 
    onPress: (part: string) => void 
}) => {
    const components: Record<string, React.ReactElement> = {
        head: <Circle cx="100" cy="40" r="30" />,
        torso: <Path d="M70 80 L130 80 L140 220 L60 220 Z" />,
        l_shoulder: <Circle cx="60" cy="90" r="15" />,
        r_shoulder: <Circle cx="140" cy="90" r="15" />,
        l_leg: <Path d="M70 230 L95 230 L90 380 L60 380 Z" />,
        r_leg: <Path d="M105 230 L130 230 L140 380 L110 380 Z" />,
        l_hand: <Circle cx="40" cy="180" r="12" />,
        r_hand: <Circle cx="160" cy="180" r="12" />
    };
    return (
        <Svg onPress={() => onPress(part)}>
            {React.cloneElement(components[part], { 
                fill: color, 
                stroke: COLORS.borderSubtle, 
                strokeWidth: 1 
            })}
        </Svg>
    );
};

const TouchMapLiteGame = ({ navigation }: any) => {
    const [activeColor, setActiveColor] = useState('rgba(0,255,0,0.4)');
    const [userMap, setUserMap] = useState<Record<string, string>>({ head: 'rgba(255,255,255,0.1)' });
    const partnerMap: Record<string, string> = {
        head: 'rgba(0,255,0,0.4)', 
        torso: 'rgba(255,0,0,0.4)', 
        l_shoulder: 'rgba(0,255,0,0.4)', 
        r_shoulder: 'rgba(0,255,0,0.4)', 
        l_leg: 'rgba(255,0,0,0.4)', 
        r_leg: 'rgba(255,0,0,0.4)', 
        l_hand: 'rgba(255,0,0,0.4)', 
        r_hand: 'rgba(255,0,0,0.4)'
    };
    const bodyParts = Object.keys(partnerMap);

    const {
        session,
        loading,
        isSyncing,
        updateScore,
        completeGame,
    } = useGameSession(GAME_ID, CATEGORY_ID);

    const handlePartPress = async (part: string) => {
        setUserMap(prev => ({ ...prev, [part]: activeColor }));
        // Update score based on configured parts
        const configuredCount = Object.keys(userMap).length + 1;
        const progress = Math.min((configuredCount / bodyParts.length) * 100, 100);
        await updateScore(progress);
    };

    const handleComplete = async () => {
        await completeGame();
        navigation?.goBack?.();
    };
    
    const mismatches = Object.keys(userMap).filter(part => userMap[part] && userMap[part] !== partnerMap[part]).length;
    const syncRate = Math.round(((bodyParts.length - mismatches) / bodyParts.length) * 100);

    if (loading) {
        return (
            <ScreenLayout showHeader={false}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.aquaTeal} />
                    <Typography variant="body" style={styles.loadingText}>
                        Loading game session...
                    </Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundSecondary]} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {isSyncing && (
                        <View style={styles.syncIndicator}>
                            <ActivityIndicator size="small" color={COLORS.aquaTeal} />
                            <Typography variant="caption" style={styles.syncText}>Syncing...</Typography>
                        </View>
                    )}

                    <Typography variant="h1" center>Touch Map Lite</Typography>
                    <Typography variant="body" center style={styles.subtitle}>Where is it okay to touch?</Typography>

                    <View style={styles.colorSelector}>
                        <SquishyButton 
                            onPress={() => setActiveColor('rgba(0,255,0,0.4)')} 
                            size="small" 
                            variant="secondary"
                            style={[styles.selectorButton, {backgroundColor: COLORS.mintGreen}]}
                        >
                            <Typography variant="caption" style={styles.selectorText}>Safe</Typography>
                        </SquishyButton>
                        <SquishyButton 
                            onPress={() => setActiveColor('rgba(255,255,0,0.4)')} 
                            size="small" 
                            variant="secondary"
                            style={[styles.selectorButton, {backgroundColor: COLORS.warning}]}
                        >
                            <Typography variant="caption" style={styles.selectorText}>Caution</Typography>
                        </SquishyButton>
                        <SquishyButton 
                            onPress={() => setActiveColor('rgba(255,0,0,0.4)')} 
                            size="small" 
                            variant="secondary"
                            style={[styles.selectorButton, {backgroundColor: COLORS.error}]}
                        >
                            <Typography variant="caption" style={styles.selectorText}>Off-limits</Typography>
                        </SquishyButton>
                    </View>

                    <View style={styles.mapsContainer}>
                        <GlassCard style={styles.mapCard}>
                            <Typography variant="caption" style={styles.mapTitle}>Your Map</Typography>
                            <Svg height="300" width="150" viewBox="0 0 200 400">
                                {bodyParts.map(part => (
                                    <BodyPart 
                                        key={part} 
                                        part={part} 
                                        color={userMap[part] || 'rgba(255,255,255,0.1)'} 
                                        onPress={handlePartPress} 
                                    />
                                ))}
                            </Svg>
                        </GlassCard>
                        <GlassCard style={styles.mapCard}>
                            <Typography variant="caption" style={styles.mapTitle}>Partner's Map</Typography>
                            <Svg height="300" width="150" viewBox="0 0 200 400">
                                {bodyParts.map(part => (
                                    <BodyPart 
                                        key={part} 
                                        part={part} 
                                        color={partnerMap[part]} 
                                        onPress={() => {}} 
                                    />
                                ))}
                            </Svg>
                        </GlassCard>
                    </View>

                    <View style={styles.statsContainer}>
                        <GlassCard style={styles.statBox}>
                            <Typography variant="caption" style={styles.statLabel}>Sync Rate</Typography>
                            <Typography variant="h1" style={styles.statValue}>{syncRate}%</Typography>
                        </GlassCard>
                        <GlassCard style={styles.statBox}>
                            <Typography variant="caption" style={styles.statLabel}>Mismatches</Typography>
                            <Typography variant="h1" style={[styles.statValue, {color: COLORS.warning}]}>{mismatches}</Typography>
                        </GlassCard>
                    </View>

                    <SquishyButton onPress={handleComplete} style={styles.completeButton} variant="primary">
                        <Typography variant="button">Complete Game</Typography>
                    </SquishyButton>
                </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: SPACING.regular 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.regular,
        color: COLORS.textSecondary,
    },
    syncIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: SPACING.small,
        padding: SPACING.small,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.medium,
    },
    syncText: {
        marginLeft: SPACING.small,
        color: COLORS.textSecondary,
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.large 
    },
    colorSelector: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.small, 
        marginBottom: SPACING.large 
    },
    selectorButton: { 
        flex: 1, 
        marginHorizontal: SPACING.tiny,
    },
    selectorText: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold' 
    },
    mapsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.large 
    },
    mapCard: { 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    mapTitle: { 
        marginBottom: SPACING.small, 
        textTransform: 'uppercase' 
    },
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        marginBottom: SPACING.large,
    },
    statBox: { 
        padding: SPACING.regular, 
        flex: 1, 
        marginHorizontal: SPACING.small, 
        alignItems: 'center' 
    },
    statLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.small 
    },
    statValue: { 
        color: COLORS.textPrimary 
    },
    completeButton: {
        marginTop: SPACING.regular,
        marginBottom: SPACING.xlarge,
    },
});

export default TouchMapLiteGame;
