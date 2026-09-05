import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Placeholder for Lottie Animation
const LottieView = View; 

const bingoTilesData = [
    { icon: 'spa', text: 'Massage' }, { icon: 'forum', text: 'Deep Talk' }, { icon: 'co2', text: 'New Scents' }, { icon: 'music_note', text: 'Music Sync' }, { icon: 'auto_awesome', text: 'Stargaze' },
    { icon: 'flare', text: 'Candlelight' }, { icon: 'nightlight', text: 'Slow Dance' }, { icon: 'record_voice_over', text: 'Whisper' }, { icon: 'flight', text: 'Feather' }, { icon: 'bathtub', text: 'Bath Time' },
    { icon: 'menu_book', text: 'Read Aloud' }, { icon: 'bed', text: 'Cuddle' }, { icon: 'favorite', text: 'Free Love', isFree: true }, { icon: 'visibility', text: 'Eye Contact' }, { icon: 'pan_tool', text: 'Holding' },
    { icon: 'edit_note', text: 'Love Letter' }, { icon: 'restaurant', text: 'Dinner Date' }, { icon: 'help_center', text: 'Truth/Dare' }, { icon: 'directions_walk', text: 'Night Walk' }, { icon: 'cloud', text: 'Dreams' },
    { icon: 'queue_music', text: 'Playlist' }, { icon: 'lightbulb', text: 'Soft Light' }, { icon: 'oil_barrel', text: 'Oils' }, { icon: 'air', text: 'Breathing' }, { icon: 'family_restroom', text: 'Warm Hug' },
];

const BingoTile = ({ icon, text, isActive, isFree, onPress }: { icon: string, text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => {
    if (isFree) {
        return (
            <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={[styles.bingoTile, styles.freeSpace]}
            >
                <Typography variant="h3" center>💖</Typography>
                <Typography variant="caption" center style={styles.freeSpaceText}>Free Love</Typography>
            </LinearGradient>
        );
    }

    return (
        <SquishyButton style={[styles.bingoTile, isActive && styles.activeTile]} onPress={onPress}>
            <Typography variant="h3" center>{icon}</Typography>
            <Typography variant="caption" center style={styles.tileText}>{text}</Typography>
        </SquishyButton>
    );
};

const BedroomBingoCardScreen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((_, i) => i % 3 === 0) // Mock active tiles
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    const completedPercentage = (activeTiles.filter(Boolean).length / 25) * 100;

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="body">Connect intimately through shared experiences! Each tile represents a new way to deepen your bond.</Typography>
                </View>
            </View>
            
            <Typography variant="h1" center style={styles.title}>Bedroom Bingo</Typography>
            
            <ScrollView contentContainerStyle={styles.content}>
                <Typography variant="h2" center style={styles.subtitle}>Ignite your connection through 25 shared cosmic experiences.</Typography>
                
                {/* Marcie's "Judgey Nods" Lottie Animation Placeholder */}
                <LottieView style={styles.lottiePlaceholder} />

                <View style={styles.bingoGrid}>
                    {bingoTilesData.map((tile, index) => (
                        <BingoTile 
                            key={index}
                            {...tile}
                            isActive={!!activeTiles[index]}
                            onPress={() => toggleTile(index)}
                        />
                    ))}
                </View>

                <LinearGradient
                    colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.progressContainer}
                >
                    <Typography variant="h3" style={styles.progressTitle}>Current Progress</Typography>
                    <Typography variant="body" style={styles.progressSubtitle}>You're making beautiful memories together</Typography>
                    <View style={styles.progressBar}>
                        <LinearGradient colors={GRADIENTS.primary.colors} style={[styles.progressFill, {width: `${completedPercentage}%`}]} />
                    </View>
                    <Typography variant="caption" style={styles.progressCount}>{activeTiles.filter(Boolean).length} / 25 Completed</Typography>
                </LinearGradient>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundSecondary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        margin: SPACING.regular,
        marginBottom: SPACING.small
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    title: {
        marginVertical: SPACING.regular,
    },
    content: { 
        padding: SPACING.regular 
    },
    subtitle: { 
        color: COLORS.vibrantPink, 
        textAlign: 'center', 
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.large,
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
        justifyContent: 'center',
        margin: -SPACING.tiny,
    },
    bingoTile: {
        width: '18%', 
        aspectRatio: 1,
        margin: '1%',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.tiny,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.small,
    },
    activeTile: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: COLORS.vibrantPink,
    },
    freeSpace: {
        borderRadius: BORDER_RADIUS.xlarge,
    },
    progressContainer: { 
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular, 
        marginTop: SPACING.xlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    progressBar: { 
        height: 10, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.small, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        marginVertical: SPACING.regular,
    },
    progressFill: {
        height: '100%',
    },
});

export default BedroomBingoCardScreen;
