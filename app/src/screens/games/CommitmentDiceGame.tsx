import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const actions = [{icon: 'local_florist', text: 'BUY FLOWERS'}, {icon: 'restaurant', text: 'COOK DINNER'}, {icon: 'volunteer_activism', text: 'GIVE MASSAGE'}];
const subjects = [{icon: 'kitchen', text: 'FOR KITCHEN'}, {icon: 'weekend', text: 'FOR THE WEEKEND'}, {icon: 'schedule', text: 'FOR 20 MINUTES'}];
const reasons = ['"Because you tolerate my snoring"', '"Because you are my everything"', '"Because I love you"' ];

const Dice = ({ result }: { result: {icon: string, text: string} }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={styles.dice}
    >
        <Typography variant="h2" style={styles.diceIcon}>{result.icon}</Typography>
        <Typography variant="caption" center style={styles.diceText}>{result.text}</Typography>
    </LinearGradient>
);

const CommitmentDiceGameScreen = () => {
    const [action, setAction] = useState(actions[0]);
    const [subject, setSubject] = useState(subjects[0]);
    const [reason, setReason] = useState(reasons[0]);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            const newAction = actions[Math.floor(Math.random() * actions.length)];
            const newSubject = subjects[Math.floor(Math.random() * subjects.length)];
            const newReason = reasons[Math.floor(Math.random() * reasons.length)];
            setAction(newAction);
            setSubject(newSubject);
            setReason(newReason);
            setIsRolling(false);
        }, 1000); // Simulate rolling animation - uses raw duration but this is animation timing, not theme animation
    };

    useEffect(rollDice, []);

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
                        <Typography variant="body">Roll the dice for random acts of commitment! Small gestures build lasting bonds.</Typography>
                    </View>
                </GlassCard>
                
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.diceContainer}>
                        <Dice result={action} />
                        <Typography variant="h2" style={styles.plus}>+</Typography>
                        <Dice result={subject} />
                    </View>

                    <GlassCard style={styles.reasonCard}>
                        <Typography variant="label" center style={styles.reasonLabel}>The Reason</Typography>
                        <Typography variant="h3" center style={styles.reasonText}>{reason}</Typography>
                        <SquishyButton onPress={rollDice} disabled={isRolling} style={styles.rollButton}>
                            <Typography variant="button" style={styles.buttonText}>
                                {isRolling ? 'ROLLING...' : 'ROLL AGAIN'}
                            </Typography>
                        </SquishyButton>
                    </GlassCard>
                    
                    <GlassCard style={styles.hostContainer}>
                        <Typography variant="body" center style={styles.hostQuote}>"Try to make it look like you mean it, darling!"</Typography>
                        <Typography variant="caption" center style={styles.hostName}>Dr. Marcie Liss</Typography>
                    </GlassCard>

                    <View style={styles.logContainer}>
                         <Typography variant="h2" style={styles.logTitle}>Recent Commitments</Typography>
                        {/* Log items would be populated from state */}
                    </View>

                </ScrollView>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
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
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    diceContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: SPACING.xxlarge 
    },
    dice: { 
        width: 140, 
        height: 140, 
        borderRadius: BORDER_RADIUS.xlarge, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginHorizontal: SPACING.regular, 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    diceIcon: { 
        color: COLORS.textPrimary 
    },
    diceText: { 
        color: COLORS.textPrimary, 
        marginTop: SPACING.small, 
        textTransform: 'uppercase' 
    },
    plus: { 
        color: COLORS.textHint 
    },
    reasonCard: { 
        padding: SPACING.regular, 
        width: '100%', 
        alignItems: 'center', 
        marginBottom: SPACING.xxlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    reasonLabel: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase', 
        letterSpacing: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.medium,
    },
    reasonText: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic', 
        marginVertical: SPACING.regular, 
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.medium,
    },
    rollButton: { 
        marginTop: SPACING.small,
        backgroundColor: COLORS.textPrimary,
    },
    hostContainer: { 
        alignItems: 'center', 
        marginBottom: SPACING.xxlarge,
        padding: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    hostQuote: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    hostName: { 
        color: COLORS.textSecondary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.medium,
    },
    logContainer: { 
        width: '100%' 
    },
    logTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.micro,
        borderRadius: BORDER_RADIUS.medium,
    },
    buttonText: {
        color: COLORS.gradientStart,
    },
});

export default CommitmentDiceGameScreen;
