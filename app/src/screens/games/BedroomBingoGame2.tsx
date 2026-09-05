import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const bingoTilesData = [
    { icon: 'spa', text: 'Massage' }, { icon: 'restaurant', text: 'Dinner Date' }, { icon: 'favorite', text: 'Long Kiss' }, { icon: 'wine_bar', text: 'Nightcap' }, { icon: 'celebration', text: 'Surprise' },
    { icon: 'music_note', text: 'Slow Dance' }, { icon: 'auto_awesome', text: 'Lingerie' }, { icon: 'light', text: 'Candlelight' }, { icon: 'menu_book', text: 'Reading' }, { icon: 'bed', text: 'Breakfast' },
    { icon: 'wb_sunny', text: 'Sunrise' }, { icon: 'self_improvement', text: 'Connection' }, { text: 'Free Space', isFree: true }, { icon: 'mms', text: 'Photos' }, { icon: 'mood', text: 'Eye Contact' },
    { icon: 'local_florist', text: 'Flowers' }, { icon: 'bathtub', text: 'Shared Bath' }, { icon: 'history_edu', text: 'Love Letter' }, { icon: 'volunteer_activism', text: 'Hold Hands' }, { icon: 'rocket_launch', text: 'New Thing' },
    { icon: 'dark_mode', text: 'Stargazing' }, { icon: 'theaters', text: 'Movie Night' }, { icon: 'nights_stay', text: 'Cuddle' }, { icon: 'chat', text: 'Deep Talk' }, { icon: 'blind', text: 'Blindfold' },
];

const BingoTile = ({ icon, text, isActive, isFree, onPress }: { icon?: string, text: string, isActive: boolean, isFree?: boolean, onPress: () => void }) => (
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
            {icon && <Typography variant="h2" center style={styles.tileIcon}>{icon}</Typography>}
            <Typography variant="caption" center style={[styles.bingoText, isFree && styles.freeSpaceText]}>{text}</Typography>
        </SquishyButton>
    </LinearGradient>
);

const BedroomBingoGame2Screen = () => {
    const [activeTiles, setActiveTiles] = useState<boolean[]>(
        bingoTilesData.map((t, i) => t.isFree || i % 5 === 0)
    );

    const toggleTile = (index: number) => {
        const newActiveTiles = [...activeTiles];
        newActiveTiles[index] = !newActiveTiles[index];
        setActiveTiles(newActiveTiles);
    };

    const completedCount = activeTiles.filter(Boolean).length;

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
                <View style={styles.bingoGridContainer}>
                    <View style={styles.bingoGrid}>
                        {['B','I','N','G','O'].map(l => <Typography key={l} variant="h2" center style={styles.gridHeader}>{l}</Typography>)}
                        {bingoTilesData.map((tile, index) => (
                            <BingoTile 
                                key={index}
                                {...tile}
                                isActive={!!activeTiles[index]}
                                onPress={() => toggleTile(index)}
                            />
                        ))}
                    </View>
                </View>

                <LinearGradient
                    colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.footerContainer}
                >
                     <Typography variant="h3" style={styles.completedCount}>{completedCount} / 24 Acts Completed</Typography>
                    <SquishyButton onPress={() => {}} style={styles.nextChallengeButton}>
                        <Typography variant="button" style={styles.nextChallengeText}>Next Challenge</Typography>
                    </SquishyButton>
                </LinearGradient>

                <LinearGradient
                    colors={[COLORS.mintGreen, COLORS.softViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hostContainer}
                >
                    <Typography variant="sass" style={styles.hostQuote}>"Keep going, darling... you're almost there. I can feel the tension from here."</Typography>
                    <Typography variant="caption" style={styles.hostSignature}>Dr. Marcie Liss</Typography>
                </LinearGradient>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
  tileIcon: {
    marginBottom: SPACING.micro,
  },
  completedCount: {
    color: COLORS.vibrantPink,
  },
  nextChallengeText: {
    color: COLORS.textSecondary,
  },
  hostQuote: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  hostSignature: {
    color: COLORS.textHint,
    fontStyle: 'italic',
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
    bingoGridContainer: {
        backgroundColor: 'rgba(39, 27, 39, 0.3)',
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    bingoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridHeader: { 
        width: '20%', 
        textAlign: 'center', 
        color: COLORS.vibrantPink, 
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
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
        borderColor: COLORS.vibrantPink,
        shadowColor: COLORS.vibrantPink,
        shadowRadius: 8,
        shadowOpacity: 0.5
    },
    freeSpace: { 
        backgroundColor: 'rgba(219, 20, 124, 0.3)',
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle
    },
    bingoText: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase' 
    },
    freeSpaceText: { 
        color: COLORS.textPrimary, 
    },
    footerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: SPACING.regular, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    nextChallengeButton: { 
        backgroundColor: COLORS.textPrimary,
    },
    hostContainer: { 
        position: 'absolute', 
        bottom: SPACING.regular, 
        right: SPACING.regular, 
        width: '40%',
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
        padding: SPACING.regular,
    },
});

export default BedroomBingoGame2Screen;
