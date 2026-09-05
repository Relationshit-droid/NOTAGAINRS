import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const PlayerCard = ({ name, coins, color, onBid }: { name: string, coins: number, color: string, onBid: () => void }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={[styles.playerCard, { borderColor: color }]}
    >
        <Typography variant="h3" center style={styles.playerName}>{name}</Typography>
        <Typography variant="h2" center style={styles.playerCoins}>{coins}</Typography>
        <Typography variant="caption" center style={styles.playerLabel}>Emotional Coins</Typography>
        <SquishyButton onPress={onBid} style={styles.bidButton}>
            <Typography variant="button" style={styles.bidButtonText}>BID 25 COINS</Typography>
        </SquishyButton>
    </LinearGradient>
);

const AppreciationAuctionGameScreen = () => {
    const [playerACoins, setPlayerACoins] = useState(450);
    const [playerBCoins, setPlayerBCoins] = useState(320);
    const [currentBid, setCurrentBid] = useState(150);
    const [highestBidder, setHighestBidder] = useState('Jamie');

    const handleBid = (player: 'A' | 'B') => {
        const bidAmount = player === 'A' ? 25 : 50;
        if (player === 'A') {
            setPlayerACoins(playerACoins - bidAmount);
            setHighestBidder('Alex');
        } else {
            setPlayerBCoins(playerBCoins - bidAmount);
            setHighestBidder('Jamie');
        }
        setCurrentBid(currentBid + bidAmount);
    };

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
        <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.deepCosmic]} style={styles.background} />
        
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="body">Bid on authentic appreciation! Genuine compliments are worth their weight in gold.</Typography>
          </View>
        </View>
        
        <Typography variant="h1" center style={styles.title}>Appreciation Auction</Typography>
        
        <ScrollView contentContainerStyle={styles.content}>
            <LinearGradient
                colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.auctionPodium}
            >
                <Typography variant="h2" center style={styles.auctioneerName}>Dr. Marcie Liss</Typography>
                <Typography variant="sass" center style={styles.auctioneerQuote}>"Going once, going twice..."</Typography>
                <LinearGradient
                    colors={[COLORS.mintGreen, COLORS.softViolet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.appreciationCard}
                >
                    <Typography variant="h2" center style={styles.appreciationText}>"You fold laundry like a Zen master"</Typography>
                    <View style={styles.bidInfo}>
                        <Typography variant="h1" center style={styles.currentBidText}>{currentBid}</Typography>
                        <Typography variant="caption" center style={styles.highestBidderText}>Highest Bidder: {highestBidder}</Typography>
                    </View>
                </LinearGradient>
            </LinearGradient>

            <View style={styles.playersContainer}>
                <PlayerCard name="Alex" coins={playerACoins} color={COLORS.info} onBid={() => handleBid('A')} />
                <PlayerCard name="Jamie" coins={playerBCoins} color={COLORS.vibrantPink} onBid={() => handleBid('B')} />
            </View>
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
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    title: {
        marginVertical: SPACING.regular,
    },
    content: { 
        padding: SPACING.regular 
    },
    auctionPodium: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    auctioneerName: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.large,
    },
    auctioneerQuote: { 
        color: COLORS.warmOrange, 
        marginBottom: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.large,
    },
    appreciationCard: {
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.xlarge,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    bidInfo: { 
        alignItems: 'center',
        marginTop: SPACING.regular,
    },
    playersContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around' 
    },
    playerCard: {
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        alignItems: 'center',
        width: '45%',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    bidButton: {
        marginTop: SPACING.regular,
        backgroundColor: COLORS.textPrimary,
    },
    playerName: {
        color: COLORS.textPrimary,
    },
    playerCoins: {
        color: COLORS.textPrimary,
    },
    playerLabel: {
        color: COLORS.textSecondary,
    },
    bidButtonText: {
        color: COLORS.vibrantPink,
    },
    appreciationText: {
        color: COLORS.textPrimary,
    },
    currentBidText: {
        color: COLORS.textPrimary,
    },
    highestBidderText: {
        color: COLORS.textSecondary,
    },
});

export default AppreciationAuctionGameScreen;
