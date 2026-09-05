import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';
// Placeholder for Lottie Animation
const LottieView = View; 

const bingoTilesData = [
    'Said No without Guilt', 'Respected Space', 'Digital Privacy', 'Honest Check-in',
    'Set Time Limit', 'Expressed Need', 'Honored Silences', 'Physical Bounds',
    'Financial Clarity', 'Social Battery', 'Work Life Sync', 'Priority Shield',
    'Vulnerability Safe', 'Conflict Resolution', 'No Over-explaining', 'Mutual Support',
];

const BingoTile = ({ text, isVerified, onPress }: { text: string, isVerified: boolean, onPress: () => void }) => (
    <GlassCard 
        style={[styles.bingoTile, isVerified && styles.verifiedTile]}
        onPress={onPress}
    >
        <View style={styles.tileButton}>
            <Typography variant="body" style={styles.tileIcon}>{isVerified ? '✔' : ' '}</Typography>
            <Typography variant="caption" style={styles.bingoText}>{text}</Typography>
        </View>
    </GlassCard>
);

const BoundaryBingoGridScreen = () => {
    const [verifiedTiles, setVerifiedTiles] = useState<boolean[]>(
        bingoTilesData.map((_, i) => i % 3 === 0) // Mock verified tiles
    );

    const toggleTile = (index: number) => {
        const newVerifiedTiles = [...verifiedTiles];
        newVerifiedTiles[index] = !newVerifiedTiles[index];
        setVerifiedTiles(newVerifiedTiles);
    };
    
    const verifiedCount = verifiedTiles.filter(Boolean).length;
    const progress = (verifiedCount / bingoTilesData.length) * 100;

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
                
                {/* Dr. Marcie Section */}
                <GlassCard style={styles.drMarcieSection} variant="outlined">
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="body">Establish healthy boundaries! Clear communication protects both partners' wellbeing.</Typography>
                    </View>
                </GlassCard>
                
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.mainContent}>
                         {/* Marcie's "Judgey Nods" Lottie Animation Placeholder */}
                        <LottieView style={styles.lottiePlaceholder} />
                        <View style={styles.bingoGrid}>
                            {bingoTilesData.map((text, index) => (
                                <BingoTile 
                                    key={index}
                                    text={text}
                                    isVerified={!!verifiedTiles[index]}
                                    onPress={() => toggleTile(index)}
                                />
                            ))}
                        </View>

                        <GlassCard style={styles.progressContainer}>
                            <Typography variant="h2" center style={styles.progressTitle}>Integrity Scan Result: {progress.toFixed(1)}%</Typography>
                            <View style={styles.progressBar}>
                                <LinearGradient colors={GRADIENTS.primary.colors} start={GRADIENTS.primary.start} end={GRADIENTS.primary.end} style={[styles.progressFill, {width: `${progress}%`}]} />
                            </View>
                             <Typography variant="caption" center style={styles.progressSubtitle}>{verifiedCount}/{bingoTilesData.length} boundary squares mutually verified.</Typography>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.sidebar}>
                        <Typography variant="label" style={styles.sidebarTitle}>Firmware Auditor</Typography>
                        <Typography variant="h2" style={styles.auditorName}>Marcie</Typography>
                        <Typography variant="body" style={styles.auditorQuote}>"Integrity scan complete. Boundary verified."</Typography>
                        <SquishyButton onPress={() => {}} style={styles.sidebarButton}>
                            <Typography variant="button" style={styles.sidebarButtonText}>Upload Evidence</Typography>
                        </SquishyButton>
                    </GlassCard>

                </ScrollView>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
  sidebarButtonText: {
    color: COLORS.textPrimary,
  },
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    gameTitle: {
        marginTop: SPACING.regular,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.small,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: SPACING.regular,
        marginBottom: SPACING.small,
        padding: SPACING.regular,
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.medium,
        height: SPACING.xxlarge + SPACING.medium,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
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
        padding: SPACING.regular,
    },
    content: { 
        flexDirection: 'row', 
        padding: SPACING.regular 
    },
    mainContent: { 
        flex: 3 
    },
    sidebar: { 
        flex: 1, 
        marginLeft: SPACING.regular, 
        padding: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    lottiePlaceholder: { 
        height: 100, 
        width: 100, 
        alignSelf: 'center', 
        marginBottom: SPACING.regular, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.round 
    },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(26, 13, 23, 0.6)',
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.small,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    bingoTile: {
        width: '23%', 
        aspectRatio: 1,
        margin: '1%',
        padding: SPACING.small,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.small,
    },
    tileButton: {
        flex: 1,
        justifyContent: 'space-between',
        padding: SPACING.small,
    },
    verifiedTile: {
        borderColor: COLORS.gradientStart,
        shadowColor: COLORS.gradientStart,
        shadowRadius: 10,
        shadowOpacity: 0.4,
    },
    tileIcon: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold' 
    },
    bingoText: { 
        color: COLORS.textPrimary, 
    },
    progressContainer: { 
        marginTop: SPACING.regular, 
        padding: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    progressTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressBar: { 
        height: SPACING.small + SPACING.tiny, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.round, 
        marginVertical: SPACING.small,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        overflow: 'hidden',
    },
    progressSubtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    sidebarTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.medium,
    },
    auditorName: { 
        color: COLORS.textPrimary, 
        marginTop: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    auditorQuote: { 
        color: COLORS.textSecondary, 
        fontStyle: 'italic', 
        marginBottom: SPACING.regular,
        marginTop: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    sidebarButton: { 
        padding: SPACING.small, 
        borderRadius: BORDER_RADIUS.large, 
        alignItems: 'center',
        marginTop: SPACING.small,
        backgroundColor: COLORS.textPrimary,
    },
    progressFill: {
        height: '100%',
    },
});

export default BoundaryBingoGridScreen;
