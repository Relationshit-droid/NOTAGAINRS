import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Image } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const BidRadarGameScreen = () => {
    const [myBid, setMyBid] = useState('');
    const [partnerPerception, setPartnerPerception] = useState('"Are you mad at me for not helping?"');
    const [result, setResult] = useState('Partial Match');
    const [explanation, setExplanation] = useState('Marcus was actually just tired from the heat, but he wanted a hug.');

    const lockBid = () => {
        // In a real app, this would send the bid to a backend and wait for the partner's perception
        console.log('Bid locked:', myBid);
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                {/* Dr. Marcie Section */}
                <GlassCard style={styles.drMarcieSection} variant="outlined">
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="body">Log emotional bids to track connection attempts! Recognize when you make or receive bids for attention.</Typography>
                    </View>
                </GlassCard>
                
                <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
                <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
                
                <ScrollView contentContainerStyle={styles.content}>
                    <GlassCard style={styles.gameConsole}>
                        <LinearGradient
                            colors={GRADIENTS.primary.colors}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.inputSide}
                        >
                            <Typography variant="h2" style={styles.sideTitle}>Log Your Emotional Bid</Typography>
                            <Typography variant="body" style={styles.sideDescription}>What was an action you took today that had hidden emotional meaning?</Typography>
                            <TextInput
                                style={styles.bidInput}
                                value={myBid}
                                onChangeText={setMyBid}
                                placeholder="e.g., I sighed loudly while I was doing the dishes..."
                                placeholderTextColor={COLORS.textHint}
                                multiline
                            />
                            <SquishyButton onPress={lockBid} style={styles.lockButton}>
                                <Typography variant="button" style={styles.lockButtonText}>Lock Bid</Typography>
                            </SquishyButton>
                        </LinearGradient>

                        <LinearGradient
                            colors={[COLORS.mintGreen, COLORS.softViolet]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.revealSide}
                        >
                            <Typography variant="h2" style={styles.sideTitle}>The Reveal</Typography>
                            <Typography variant="label" style={styles.perceptionLabel}>Sarah's Perception</Typography>
                            <Typography variant="body" style={styles.perceptionText}>{partnerPerception}</Typography>
                            
                            <LinearGradient
                                colors={[COLORS.warmOrange, COLORS.brightYellow]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.resultContainer}
                            >
                               <Typography variant="label" style={styles.resultLabel}>{result}</Typography>
                               <Typography variant="body" style={styles.explanationText}>{explanation}</Typography>
                            </LinearGradient>

                             <View style={styles.statsContainer}>
                                <Typography variant="caption">Accuracy: 62%</Typography>
                                <Typography variant="caption">Bonus: +150</Typography>
                            </View>
                        </LinearGradient>
                    </GlassCard>

                    <GlassCard style={styles.marcieContainer}>
                        <Typography variant="body" style={styles.marcieQuote}>"Oh, you thought that was a sigh for help? Cute. Marcus, honey, next time try using your words or just collapsing dramatically on the floor like a normal person."</Typography>
                        <Typography variant="caption" style={styles.marcieSignature}>Dr. Marcie Liss, Host</Typography>
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
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.regular,
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
    gameTitle: {
        marginBottom: SPACING.small,
    },
    subtitle: {
        marginBottom: SPACING.regular,
        color: COLORS.textSecondary,
    },
    content: { 
        padding: SPACING.regular 
    },
    gameConsole: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    inputSide: { 
        flex: 1, 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    revealSide: { 
        flex: 1, 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.regular, 
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    sideTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    sideDescription: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    bidInput: { 
        backgroundColor: 'transparent', 
        borderWidth: 2, 
        borderColor: 'rgba(219, 20, 124, 0.3)', 
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        minHeight: SPACING.xxxlarge * 3,
        textAlignVertical: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    lockButton: { 
        marginTop: SPACING.regular,
        backgroundColor: COLORS.textPrimary,
    },
    perceptionLabel: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.tiny,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.medium,
    },
    perceptionText: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic', 
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
    },
    resultContainer: { 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    resultLabel: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.tiny,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    explanationText: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around' 
    },
    marcieContainer: { 
        borderLeftWidth: 4, 
        borderColor: COLORS.textPrimary,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    marcieQuote: { 
        fontStyle: 'italic', 
        lineHeight: SPACING.xlarge,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
    },
    marcieSignature: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.regular, 
        textAlign: 'right',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.small,
    }
});

export default BidRadarGameScreen;
