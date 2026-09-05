import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';
import { useGameSession } from '../../hooks';
import { getGameByScreen } from '../../lib/gameRegistry';

const GAME_ID = 'touch-map';
const CATEGORY_ID = 'romance-hub';

const consentColors = {
    yes: COLORS.success,
    maybe: COLORS.warning,
    no: COLORS.error,
};

const frontZones = [
    { id: 'f_head', shape: 'Circle', args: { cx: '50%', cy: '15%', r: '10%' } },
    { id: 'f_torso', shape: 'Rect', args: { x: '30%', y: '25%', width: '40%', height: '30%' } },
    { id: 'f_l_arm', shape: 'Rect', args: { x: '15%', y: '27%', width: '15%', height: '25%' } },
    { id: 'f_r_arm', shape: 'Rect', args: { x: '70%', y: '27%', width: '15%', height: '25%' } },
    { id: 'f_legs', shape: 'Rect', args: { x: '30%', y: '55%', width: '40%', height: '40%' } },
];

const backZones = [
    { id: 'b_head', shape: 'Circle', args: { cx: '50%', cy: '15%', r: '10%' } },
    { id: 'b_back', shape: 'Rect', args: { x: '30%', y: '25%', width: '40%', height: '30%' } },
];

const Zone = ({ zone, color, onPress }: { zone: any; color: string; onPress: () => void }) => {
    const Component = zone.shape === 'Circle' ? Circle : Rect;
    return (
        <SquishyButton onPress={onPress} variant="ghost" style={styles.zoneButton}>
            <Component {...zone.args} fill={color} opacity="0.4" />
        </SquishyButton>
    );
};

const TouchMapPreferenceGame1 = ({ navigation }: any) => {
    const [selectedColor, setSelectedColor] = useState(consentColors.yes);
    const [zoneColors, setZoneColors] = useState<Record<string, string>>({});

    const {
        session,
        loading,
        isSyncing,
        updateScore,
        completeGame,
    } = useGameSession(GAME_ID, CATEGORY_ID);

    const handleZonePress = async (zoneId: string) => {
        setZoneColors(prev => ({ ...prev, [zoneId]: selectedColor }));
        // Update score based on configured zones
        const totalZones = frontZones.length + backZones.length;
        const configuredCount = Object.keys(zoneColors).length + 1;
        const progress = Math.min((configuredCount / totalZones) * 100, 100);
        await updateScore(progress);
    };

    const handleComplete = async () => {
        await completeGame();
        navigation?.goBack?.();
    };

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
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.container}>
                <ScrollView>
                    {isSyncing && (
                        <View style={styles.syncIndicator}>
                            <ActivityIndicator size="small" color={COLORS.aquaTeal} />
                            <Typography variant="caption" style={styles.syncText}>Syncing...</Typography>
                        </View>
                    )}

                    <Typography variant="h1" center style={styles.title}>
                        The Love Arcade
                    </Typography>
                    <Typography variant="h2" center style={styles.subtitle}>
                        +100 Games to Deepen Connection
                    </Typography>
                    
                    <Typography variant="body" center style={styles.instructions}>
                        Define Your Boundaries
                    </Typography>
                    <Typography variant="caption" center style={styles.caption}>
                        Select a color, then tap to mark your preference.
                    </Typography>
                    
                    <View style={styles.mapArea}>
                        <View style={styles.silhouetteContainer}>
                            <Typography variant="caption" style={styles.mapLabel}>FRONT</Typography>
                            <Svg width="100%" height="100%">
                                <Image 
                                    source={{'uri':'https://lh3.googleusercontent.com/aida-public/AB6AXuB2UWKyEDKbKyVg29sz0dwSPUvtT-pHdFj4Mxs_2m5WW3XLo7sKVY0qzq6wO4DAe0A7Jm7azxrR8FH5uLcFi0YHeeYug8eBWN9DoYQRsjzbFnxzcAlXctQXto_OvBhbU6cau0gq5CVkYSs-gB00-veE9s9-aVSHsPp2_3LS4Hi_M99HFeexBFujBEwKilYfxc64dnIq8699e8EypubyiJ2c5MccVr5rq21Qg8PsNAtfqj-PTPbWxmv6odjrBaLc8oz6AbelrekwjPzB'}} 
                                    width="100%" 
                                    height="100%" 
                                    preserveAspectRatio="xMidYMid slice" 
                                    opacity={0.7}
                                />
                                {frontZones.map(zone => (
                                    <Zone 
                                        key={zone.id} 
                                        zone={zone} 
                                        color={zoneColors[zone.id] || 'transparent'} 
                                        onPress={() => handleZonePress(zone.id)} 
                                    />
                                ))}
                            </Svg>
                        </View>
                        <View style={styles.silhouetteContainer}>
                            <Typography variant="caption" style={styles.mapLabel}>BACK</Typography>
                            <Svg width="100%" height="100%">
                                <Image 
                                    source={{'uri':'https://lh3.googleusercontent.com/aida-public/AB6AXuDyzBgbsINisi-F2bwWogMl_RNPBRSPa-2YjgenFL5wxbHylYe_9yYGfNjlRCeSx2cl1XSjBd7G4y4g5_o2po9rQsjQE-5KggQmP2THDgBnGiz6hYaYy5F-9MfEjc4b5pOpXQZB86i8NusC-4EouHtvcoSeJ007O5M8mS398zWuXH7Q0mvf_-ahAmQaP49DmfUbHNdx-A81RdvAzSPjhRB-Ns0o-bFOSQ-9BRrlWdLEyf8FSaj-I6NAwRMOf55_vvaPNhlU_NbxVVRl'}} 
                                    width="100%" 
                                    height="100%" 
                                    preserveAspectRatio="xMidYMid slice" 
                                    opacity={0.7}
                                />
                                {backZones.map(zone => (
                                    <Zone 
                                        key={zone.id} 
                                        zone={zone} 
                                        color={zoneColors[zone.id] || 'transparent'} 
                                        onPress={() => handleZonePress(zone.id)} 
                                    />
                                ))}
                            </Svg>
                        </View>
                    </View>
                    
                    <GlassCard style={styles.palette}>
                        <SquishyButton 
                            onPress={() => setSelectedColor(consentColors.yes)} 
                            variant={selectedColor === consentColors.yes ? 'primary' : 'ghost'}
                            style={styles.paletteButton}
                        >
                            <Typography variant="button">YES</Typography>
                        </SquishyButton>
                        <SquishyButton 
                            onPress={() => setSelectedColor(consentColors.maybe)} 
                            variant={selectedColor === consentColors.maybe ? 'primary' : 'ghost'}
                            style={styles.paletteButton}
                        >
                            <Typography variant="button">MAYBE</Typography>
                        </SquishyButton>
                        <SquishyButton 
                            onPress={() => setSelectedColor(consentColors.no)} 
                            variant={selectedColor === consentColors.no ? 'primary' : 'ghost'}
                            style={styles.paletteButton}
                        >
                            <Typography variant="button">NO</Typography>
                        </SquishyButton>
                    </GlassCard>

                    <SquishyButton onPress={handleComplete} style={styles.completeButton} variant="primary">
                        <Typography variant="button">Complete Game</Typography>
                    </SquishyButton>
                </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic 
    },
    container: { 
        flex: 1, 
        padding: SPACING.screenPadding 
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
    title: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small 
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.xlarge 
    },
    instructions: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small 
    },
    caption: { 
        color: COLORS.textHint, 
        marginBottom: SPACING.large 
    },
    mapArea: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        height: 400, 
        marginBottom: SPACING.xlarge 
    },
    silhouetteContainer: { 
        flex: 1, 
        alignItems: 'center', 
        marginHorizontal: SPACING.regular 
    },
    mapLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.small, 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide 
    },
    palette: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: SPACING.medium,
        marginBottom: SPACING.large,
    },
    paletteButton: { 
        flex: 1, 
        marginHorizontal: SPACING.tiny 
    },
    zoneButton: {
        padding: 0,
        backgroundColor: 'transparent',
    },
    completeButton: {
        marginBottom: SPACING.xlarge,
    },
});

export default TouchMapPreferenceGame1;
