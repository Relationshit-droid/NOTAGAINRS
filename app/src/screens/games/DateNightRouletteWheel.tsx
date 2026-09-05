import React from 'react';
import { View, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const WheelSegment = ({ color, d, label, rotation }: { color: string, d: string, label: string, rotation: string }) => (
    <View style={styles.segmentContainer}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
            <Path d={d} fill={color} />
        </Svg>
        <View style={[styles.labelTextContainer, { transform: [{ rotate: rotation }] }]}>
            <Typography variant="caption" style={styles.labelText}>{label}</Typography>
        </View>
    </View>
);

const RotationCard = ({ label }: { label: string }) => (
    <GlassCard style={styles.card} padding="small">
        <LinearGradient 
            colors={['rgba(20, 20, 20, 0.2)', 'rgba(20, 20, 20, 0.7)']} 
            style={styles.cardOverlay}
        >
            <Typography variant="caption" center style={styles.cardLabel}>{label}</Typography>
        </LinearGradient>
    </GlassCard>
);

const DateNightRouletteWheelScreen = () => {
    const segments = [
        { color: COLORS.warmOrange, d: 'M 50 50 L 100 50 A 50 50 0 0 1 75 93.3 Z', label: 'Cooking Class', rotation: '30deg' },
        { color: COLORS.info, d: 'M 50 50 L 75 93.3 A 50 50 0 0 1 25 93.3 Z', label: 'Stargazing', rotation: '90deg' },
        { color: COLORS.mintGreen, d: 'M 50 50 L 25 93.3 A 50 50 0 0 1 0 50 Z', label: 'Wine Tasting', rotation: '150deg' },
        { color: COLORS.lavenderPurple, d: 'M 50 50 L 0 50 A 50 50 0 0 1 25 6.7 Z', label: 'Retro Arcade', rotation: '210deg' },
        { color: COLORS.brightYellow, d: 'M 50 50 L 25 6.7 A 50 50 0 0 1 75 6.7 Z', label: 'Sunset Hike', rotation: '270deg' },
        { color: COLORS.vibrantPink, d: 'M 50 50 L 75 6.7 A 50 50 0 0 1 100 50 Z', label: 'Spa Night', rotation: '330deg' },
    ];

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <GlassCard style={styles.drMarcieSection} padding="medium">
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Typography>
                </View>
            </GlassCard>
            
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Typography variant="h1" center>Date Night Roulette</Typography>
                    <Typography variant="body" center style={styles.headerSubtitle}>Leave your evening to destiny. Spin to discover your next adventure.</Typography>
                </View>

                <View style={styles.wheelSection}>
                    <View style={styles.wheelPointer} />
                    <LinearGradient
                        colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.wheelContainer}
                    >
                        <View style={styles.wheelRotate}>
                             {segments.map((seg) => <WheelSegment key={seg.label} {...seg} />)}
                        </View>
                        <LinearGradient
                            colors={[COLORS.mintGreen, COLORS.softViolet]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.wheelHub}
                        />
                    </LinearGradient>
                </View>

                <SquishyButton style={styles.spinButton} size="large">
                    <Typography variant="button">SPIN</Typography>
                </SquishyButton>

                <GlassCard style={styles.rotationSection} padding="medium">
                    <Typography variant="h3" style={styles.sectionTitle}>In the rotation</Typography>
                    <View style={styles.cardGrid}>
                        <RotationCard label="Stargazing" />
                        <RotationCard label="Cooking Class" />
                        <RotationCard label="Wine Tasting" />
                    </View>
                </GlassCard>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: SPACING.regular,
        marginBottom: SPACING.small
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.small,
        height: SPACING.xxlarge + SPACING.small,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: SPACING.xxlarge,
        height: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    scrollContainer: { 
        paddingVertical: SPACING.regular, 
        paddingHorizontal: SPACING.small, 
        alignItems: 'center' 
    },
    header: { 
        alignItems: 'center', 
        marginHorizontal: SPACING.regular, 
        marginBottom: SPACING.regular 
    },
    headerSubtitle: { 
        marginTop: SPACING.small,
        opacity: 0.8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    wheelSection: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: SPACING.regular 
    },
    wheelPointer: {
        position: 'absolute', 
        top: -SPACING.regular, 
        zIndex: 2,
        width: 0, 
        height: 0,
        borderLeftWidth: SPACING.regular, 
        borderLeftColor: 'transparent',
        borderRightWidth: SPACING.regular, 
        borderRightColor: 'transparent',
        borderTopWidth: SPACING.large, 
        borderTopColor: COLORS.textPrimary,
    },
    wheelContainer: {
        width: 350, 
        height: 350, 
        borderRadius: BORDER_RADIUS.round,
        borderWidth: SPACING.small, 
        borderColor: COLORS.backgroundSecondary, 
        overflow: 'hidden',
        ...SHADOWS.large
    },
    labelTextContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 150,
        height: 100,
        marginTop: -50,
        marginLeft: -75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        color: COLORS.backgroundSecondary,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    wheelHub: {
        position: 'absolute', 
        top: '50%', 
        left: '50%',
        width: SPACING.xxlarge + SPACING.large, 
        height: SPACING.xxlarge + SPACING.large,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        transform: [{ translateX: -30 }, { translateY: -30 }],
        zIndex: 1,
        ...SHADOWS.card
    },
    spinButton: {
        marginVertical: SPACING.xlarge,
        width: 180,
        ...SHADOWS.neon
    },
    rotationSection: { 
        width: '100%', 
        marginTop: SPACING.regular,
        ...SHADOWS.card
    },
    sectionTitle: { 
        marginBottom: SPACING.regular, 
        paddingHorizontal: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    cardGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-around' 
    },
    card: { 
        width: 110, 
        height: 110, 
        justifyContent: 'flex-end',
        ...SHADOWS.card
    },
    cardOverlay: { 
        flex: 1, 
        justifyContent: 'flex-end', 
        padding: SPACING.small, 
        borderRadius: BORDER_RADIUS.large 
    },
    cardLabel: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    segmentContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    wheelRotate: {
        transform: [{ rotate: '-90deg' }],
    },
});

export default DateNightRouletteWheelScreen;
