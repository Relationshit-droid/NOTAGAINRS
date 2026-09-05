import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const bingoTilesData = [
    'Slow Dance', 'Eye Contact', 'New Location', 'Candlelight', 'Massage',
    'Whisper', 'Hold Hands', 'Compliment', 'Deep Talk', 'Playlist',
    'Morning Hug', 'Cuddle', 'Free Space', 'Kiss', 'Date Night',
    'Surprise', 'Nature Walk', 'Soft Light', 'Truth/Dare', 'Bath Time',
    'Breakfast', 'Reading', 'Stargazing', 'Cooking', 'Sweet Note',
];

const BingoTile = ({ text, isActive, isFree, onPress }: { text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => (
    <LinearGradient
        colors={[COLORS.vibrantPink, COLORS.rosePink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bingoTile, isActive && styles.activeTile, isFree && styles.freeSpace]}
    >
        <SquishyButton 
            style={styles.tileButton}
            onPress={onPress}
            disabled={isFree}
        >
            {isFree && <Typography variant="h2" center style={styles.freeIcon}>💖</Typography>}
            <Typography variant="caption" center style={styles.tileText}>{text}</Typography>
        </SquishyButton>
    </LinearGradient>
);

const BedroomBingoGame1Screen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((t, i) => t === 'Free Space' || i % 4 === 0) // Mock active tiles
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    const completedLines = 1; // Mock data
    const progressPercentage = (completedLines / 5) * 100;

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

                <View style={styles.gameContainer}>
                    <View style={styles.bingoGrid}>
                        {bingoTilesData.map((text, index) => (
                            <BingoTile 
                                key={index}
                                text={text}
                                isActive={!!activeTiles[index]}
                                isFree={text === 'Free Space'}
                                onPress={() => toggleTile(index)}
                            />
                        ))}
                    </View>

                    <LinearGradient
                        colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sidebar}
                    >
                        <LinearGradient
                            colors={[COLORS.mintGreen, COLORS.softViolet]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.hostBubble}
                        >
                            <Typography variant="h3" style={styles.hostName}>Dr. Marcie Liss</Typography>
                            <Typography variant="sass" style={styles.hostQuote}>"Keep the fire burning, lovebirds! One more square for a diagonal Bingo!"</Typography>
                        </LinearGradient>
                        <LinearGradient
                            colors={[COLORS.warmOrange, COLORS.brightYellow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.multipliersContainer}
                        >
                            <Typography variant="caption" style={styles.multiplierTitle}>Active Multipliers</Typography>
                            <Typography variant="body" style={styles.multiplierText}>Evening Bonus: 2x Progress</Typography>
                        </LinearGradient>
                    </LinearGradient>
                </View>

            </ScrollView>
            <LinearGradient
                colors={[COLORS.vibrantPink, COLORS.rosePink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.footer}
            >
                <Typography variant="h3" center style={styles.footerTitle}>Bingo Status: {completedLines}/5 Lines Complete</Typography>
                 <View style={styles.progressBar}>
                    <LinearGradient colors={[COLORS.textPrimary, COLORS.textSecondary]} style={[styles.progressFill, {width: `${progressPercentage}%`}]} />
                </View>
                <SquishyButton onPress={() => {}} style={styles.submitButton}>
                    <Typography variant="button" style={styles.submitButtonText}>SUBMIT LINE</Typography>
                </SquishyButton>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
  freeIcon: {
    marginBottom: SPACING.micro,
  },
  tileText: {
    color: COLORS.textPrimary,
  },
  hostName: {
    color: COLORS.vibrantPink,
  },
  hostQuote: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  multiplierTitle: {
    color: COLORS.brightYellow,
  },
  multiplierText: {
    color: COLORS.textSecondary,
  },
  footerTitle: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  submitButtonText: {
    color: COLORS.textPrimary,
  },
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
    gameContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    bingoGrid: { 
        flex: 3,
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular
    },
    sidebar: { 
        flex: 1, 
        marginLeft: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    hostBubble: { 
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    multipliersContainer: { 
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    bingoTile: {
        width: '18%',
        aspectRatio: 1,
        margin: '1%',
        borderRadius: BORDER_RADIUS.large,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.small,
    },
    tileButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.tiny,
    },
    activeTile: {
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: COLORS.vibrantPink,
    },
    freeSpace: { 
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderColor: COLORS.vibrantPink,
    },
    footer: { 
        padding: SPACING.regular, 
        borderTopWidth: 1, 
        borderColor: COLORS.borderSubtle,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 1,
        ...SHADOWS.card,
    },
    progressBar: { 
        height: 12, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.medium, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        marginVertical: SPACING.regular,
    },
    submitButton: { 
        backgroundColor: COLORS.textPrimary,
    },
    progressFill: {
        height: '100%',
    },
});

export default BedroomBingoGame1Screen;
