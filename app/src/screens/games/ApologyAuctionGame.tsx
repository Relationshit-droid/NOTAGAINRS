import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const ApologyAuctionGameScreen = () => {
    const [partnerARating, setPartnerARating] = useState(42);
    const [partnerBRating, setPartnerBRating] = useState(12);

    const auctionItem = "I'm sorry you feel that way.";

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.deepCosmic]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="body">Evaluate apologies based on authenticity! Genuine remorse is the key to healing.</Typography>
                </View>
            </View>
            
            <Typography variant="h1" center style={styles.title}>Apology Auction</Typography>
            
            <View style={styles.content}>
                <LinearGradient
                    colors={GRADIENTS.primary.colors}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.auctionItemContainer}
                >
                    <Typography variant="h2" center>"{auctionItem}"</Typography>
                </LinearGradient>

                <View style={styles.biddingContainer}>
                    <LinearGradient
                        colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sliderContainer}
                    >
                        <Typography variant="caption" style={styles.partnerLabel}>Partner A</Typography>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerARating}
                            onValueChange={setPartnerARating}
                            minimumTrackTintColor={COLORS.textPrimary}
                            maximumTrackTintColor={COLORS.borderSubtle}
                            thumbTintColor={COLORS.vibrantPink}
                        />
                        <Typography variant="caption" style={styles.ratingText}>{partnerARating}%</Typography>
                    </LinearGradient>
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.sliderContainer}
                    >
                        <Typography variant="caption" style={styles.partnerLabel}>Partner B</Typography>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={partnerBRating}
                            onValueChange={setPartnerBRating}
                            minimumTrackTintColor={COLORS.textPrimary}
                            maximumTrackTintColor={COLORS.borderSubtle}
                            thumbTintColor={COLORS.vibrantPink}
                        />
                        <Typography variant="caption" style={styles.ratingText}>{partnerBRating}%</Typography>
                    </LinearGradient>
                </View>

                <LinearGradient
                    colors={[COLORS.warmOrange, COLORS.brightYellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hostContainer}
                >
                    <Typography variant="body" style={styles.hostQuote}>"That apology smells like week-old fish."</Typography>
                    <Typography variant="caption">Dr. Marcie Liss</Typography>
                </LinearGradient>

                <SquishyButton onPress={() => {}} style={styles.nextButton}>
                    <Typography variant="button" style={styles.buttonText}>Next Auction</Typography>
                </SquishyButton>
            </View>
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
        flex: 1, 
        padding: SPACING.regular, 
        justifyContent: 'space-around' 
    },
    auctionItemContainer: {
        padding: SPACING.xlarge,
        borderRadius: BORDER_RADIUS.xxlarge,
        alignItems: 'center',
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    biddingContainer: { 
        marginBottom: SPACING.regular 
    },
    sliderContainer: {
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    partnerLabel: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
        alignSelf: 'flex-start',
    },
    ratingText: { 
        color: COLORS.textPrimary, 
        textAlign: 'right',
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
        alignSelf: 'flex-end',
    },
    hostContainer: {
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    hostQuote: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.small,
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
    },
    nextButton: {
        marginTop: SPACING.regular,
    },
    buttonText: {
        color: COLORS.textPrimary,
    },
});

export default ApologyAuctionGameScreen;
