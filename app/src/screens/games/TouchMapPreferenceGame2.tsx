import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../../components/ui';
import { GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const anatomicalZones: Record<string, string> = {
    head: "M100,20 c-15,0 -25,12 -25,25 s10,25 25,25 s25,-12 25,-25 s-10,-25 -25,-25",
    neck: "M85,72 h30 v15 h-30 z",
    torso: "M60,95 h80 l10,40 l-10,120 h-80 l-10,-120 z",
    upper_arms: "M55,100 l-25,30 l15,100 l15,-10 z M145,100 l25,30 l-15,100 l-15,-10 z",
    forearms: "M45,235 l-10,80 l15,10 l10,-80 z M155,235 l10,80 l-15,10 l-10,-80 z",
    hands: "M35,330 c-5,0 -10,10 -10,20 s10,25 20,10 l5,-25 z M165,330 c5,0 10,10 10,20 s-10,25 -20,10 l-5,-25 z",
    pelvis: "M70,260 h60 l5,40 h-70 z",
    upper_legs: "M70,305 h28 v100 h-28 z M102,305 h28 v100 h-28 z",
    lower_legs: "M70,410 h25 v70 h-25 z M105,410 h25 v70 h-25 z",
    feet: "M65,485 h30 v10 h-30 z M105,485 h30 v10 h-30 z",
};

const consentColors = {
    default: COLORS.backgroundInput,
    yes: `${COLORS.success}99`,
    maybe: `${COLORS.warning}99`,
    no: `${COLORS.error}99`,
};

const partnerPrefs: Record<string, string> = { torso: 'yes', forearms: 'maybe', pelvis: 'no' };

const TouchMapPreferenceGame2 = () => {
    const [zoneColors, setZoneColors] = useState<Record<string, string>>({});
    const [activeColor, setActiveColor] = useState('yes');
    const [compare, setCompare] = useState(false);

    const handleZonePress = (zoneId: string) => {
        setZoneColors(prev => ({ ...prev, [zoneId]: activeColor }));
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.healingHospital, COLORS.backgroundSecondary]} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Typography variant="h1" center style={styles.title}>
                        The Love Arcade
                    </Typography>
                    <Typography variant="h2" center style={styles.subtitle}>
                        +100 Games to Deepen Connection
                    </Typography>

                    <Typography variant="body" center>
                        Touch Map Preference
                    </Typography>
                    <Typography variant="caption" center style={styles.caption}>
                        Tap zones to communicate comfort levels.
                    </Typography>

                    <Svg height="500" width="250" viewBox="0 0 200 500">
                        {Object.entries(anatomicalZones).map(([key, d]) => (
                            <SquishyButton
                                key={key}
                                onPress={() => handleZonePress(key)}
                                variant="ghost"
                            >
                                <Path 
                                    d={d} 
                                    fill={consentColors[zoneColors[key] as keyof typeof consentColors] || consentColors.default}
                                    stroke={COLORS.aquaTeal} 
                                    strokeWidth="1"
                                />
                            </SquishyButton>
                        ))}
                        {compare && Object.entries(partnerPrefs).map(([key, pref]) => (
                            <Path 
                                key={`${key}-partner`} 
                                d={anatomicalZones[key]} 
                                fill="none" 
                                stroke={consentColors[pref as keyof typeof consentColors]} 
                                strokeWidth="2" 
                                strokeDasharray="4, 4" 
                            />
                        ))}
                    </Svg>
                    
                    <GlassCard style={styles.controls}>
                        <View style={styles.legend}>
                            <SquishyButton 
                                onPress={() => setActiveColor('yes')} 
                                variant={activeColor === 'yes' ? 'primary' : 'ghost'}
                                style={styles.legendItem}
                            >
                                <View style={[styles.legendColor, { backgroundColor: consentColors.yes }]} />
                                <Typography variant="button">Yes</Typography>
                            </SquishyButton>
                            <SquishyButton 
                                onPress={() => setActiveColor('maybe')} 
                                variant={activeColor === 'maybe' ? 'primary' : 'ghost'}
                                style={styles.legendItem}
                            >
                                <View style={[styles.legendColor, { backgroundColor: consentColors.maybe }]} />
                                <Typography variant="button">Maybe</Typography>
                            </SquishyButton>
                            <SquishyButton 
                                onPress={() => setActiveColor('no')} 
                                variant={activeColor === 'no' ? 'primary' : 'ghost'}
                                style={styles.legendItem}
                            >
                                <View style={[styles.legendColor, { backgroundColor: consentColors.no }]} />
                                <Typography variant="button">No</Typography>
                            </SquishyButton>
                        </View>
                        <View style={styles.switchContainer}>
                            <Typography variant="body">Compare Maps</Typography>
                            <Switch 
                                value={compare} 
                                onValueChange={setCompare} 
                                trackColor={{ false: COLORS.textDisabled, true: COLORS.vibrantPink }} 
                                thumbColor={COLORS.textPrimary} 
                            />
                        </View>
                    </GlassCard>
                </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.healingHospital 
    },
    container: { 
        flex: 1 
    },
    scrollContent: {
        alignItems: 'center', 
        padding: SPACING.screenPadding
    },
    title: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small 
    },
    subtitle: { 
        color: COLORS.textSecondary, 
        marginBottom: SPACING.large 
    },
    caption: {
        marginBottom: SPACING.large
    },
    controls: { 
        width: '100%', 
        padding: SPACING.xlarge
    },
    legend: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: SPACING.xlarge 
    },
    legendItem: { 
        flexDirection: 'row', 
        alignItems: 'center',
        flex: 1,
        marginHorizontal: SPACING.tiny
    }, 
    legendColor: { 
        width: 20, 
        height: 20, 
        borderRadius: BORDER_RADIUS.small, 
        marginRight: SPACING.small 
    },
    switchContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: SPACING.regular 
    },
});

export default TouchMapPreferenceGame2;
