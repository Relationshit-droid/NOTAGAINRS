import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Header, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';

const initialTower = [
    ['Respect Space', 'Daily Check-in', 'Date Nights'],
    ['Laundry Duty Share', 'Holiday Rotation'],
    ['Therapy Sat', null, 'Quiet Time'],
    ['No Work After 7PM', 'Trash Tuesday'],
    [null, 'Netflix Choice', 'Gym Partner']
];

const JengaBlock = ({ text }: { text: string | null }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={[styles.jengaBlock, !text && styles.emptyBlock]}
    >
        {text && <Typography variant="caption">{text}</Typography>}
    </LinearGradient>
);

const CompromiseJengaGameScreen = () => {
    const [tower, setTower] = useState(initialTower);
    const [stability, setStability] = useState(75);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Build a compromise tower! Stack concessions to create a stable solution together.</Typography>
                </View>
            </View>
            
            <Header title="Compromise Jenga" />
            <View style={styles.gameLayout}>
                <LinearGradient
                    colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.sidebar}
                >
                    <Typography variant="h2" style={styles.sidebarTitle}>Compromise Warehouse</Typography>
                    {/* Placeholder for draggable blocks */}
                </LinearGradient>
                <ScrollView contentContainerStyle={styles.gameStage}>
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.stabilityMeter}
                    >
                        <Typography variant="h2" style={styles.meterTitle}>STABILITY: {stability}%</Typography>
                        <View style={styles.meterBar}>
                            <LinearGradient 
                                colors={GRADIENTS.primary.colors} 
                                style={[styles.progressFill, {width: `${stability}%`}]} 
                            />
                        </View>
                    </LinearGradient>

                    <View style={styles.towerContainer}>
                        {tower.map((layer, i) => (
                            <View key={i} style={styles.towerLayer}>
                                {layer.map((block, j) => <JengaBlock key={j} text={block} />)}
                            </View>
                        ))}
                         <LinearGradient
                            colors={[COLORS.warmOrange, COLORS.brightYellow]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.dropZone}
                         >
                            <Typography variant="body" style={styles.dropZoneText}>Drop Block Here</Typography>
                        </LinearGradient>
                    </View>

                    <LinearGradient
                        colors={[COLORS.warmOrange, COLORS.brightYellow]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.hostContainer}
                    >
                        <Typography variant="body" style={styles.hostQuote}>"Gravity always wins... and so does resentment if you aren't careful with your foundation!"</Typography>
                        <Typography variant="caption" style={styles.hostName}>- Dr. Marcie Liss</Typography>
                    </LinearGradient>

                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundPrimary },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        margin: SPACING.regular,
        marginBottom: SPACING.small,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover',
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
    gameLayout: { flexDirection: 'row', flex: 1 },
    sidebar: { 
        width: 200, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    sidebarTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    gameStage: { flex: 1, padding: SPACING.regular, alignItems: 'center' },
    stabilityMeter: { 
        width: '90%', 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.regular, 
        marginBottom: SPACING.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    meterTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    meterBar: { 
        height: 10, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.round, 
        marginTop: SPACING.small,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    towerContainer: { width: '80%', alignItems: 'center' },
    towerLayer: { flexDirection: 'row', marginBottom: SPACING.small, justifyContent: 'center' },
    jengaBlock: { 
        borderRadius: BORDER_RADIUS.medium,
        height: 40,
        flex: 1,
        marginHorizontal: SPACING.tiny,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: SPACING.small,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.small,
    },
    emptyBlock: { backgroundColor: 'transparent', borderColor: 'transparent' },
    dropZone: { 
        height: 50, 
        width: '60%', 
        borderRadius: BORDER_RADIUS.large, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        borderStyle: 'dashed',
        ...SHADOWS.large,
    },
    dropZoneText: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    hostContainer: { 
        position: 'absolute', 
        bottom: SPACING.regular, 
        left: SPACING.regular, 
        width: '45%', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    hostQuote: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    hostName: { 
        color: COLORS.textPrimary, 
        textAlign: 'right', 
        marginTop: SPACING.small,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressFill: {
        height: '100%',
    },
});

export default CompromiseJengaGameScreen;
