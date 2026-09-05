import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Header, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';

const topics = [{icon: 'rebase_edit', text: 'The Dishwasher'}, {icon: 'schedule', text: 'Being Late'}, {icon: 'phone_android', text: 'Screen Time'}];
const constraints = [{icon: 'record_voice_over', text: 'Whispering Only'}, {icon: 'edit_note', text: 'Use "I feel" statements'}, {icon: 'timer', text: '5-Minute Limit'}];

const Dice = ({ result, color }: { result: {icon: string, text: string}, color: string }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={[styles.dice, {borderColor: color}]}
    >
        <Typography variant="h1" style={styles.diceIcon}>{result.icon}</Typography>
        <Typography variant="body" style={styles.diceText}>{result.text}</Typography>
    </LinearGradient>
);

const ConflictDiceGameScreen = () => {
    const [topic, setTopic] = useState(topics[0]);
    const [constraint, setConstraint] = useState(constraints[0]);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            const newTopic = topics[Math.floor(Math.random() * topics.length)];
            const newConstraint = constraints[Math.floor(Math.random() * constraints.length)];
            setTopic(newTopic);
            setConstraint(newConstraint);
            setIsRolling(false);
        }, ANIMATIONS.duration.slow);
    };

    useEffect(rollDice, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.deepCosmic]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Practice conflict resolution with random scenarios! Constraints make communication more creative.</Typography>
                </View>
            </View>
            
            <Header title="Conflict Dice Arena" />
            <View style={styles.gameLayout}>
                <LinearGradient
                    colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.refereeSidebar}
                >
                    <Typography variant="h2" style={styles.sidebarTitle}>Referee</Typography>
                    <Typography variant="body" style={styles.refereeName}>Dr. Marcie Liss</Typography>
                     <Typography variant="body" style={styles.refereeQuote}>"Use 'I feel' instead of 'You always' to avoid a yellow card."</Typography>
                </LinearGradient>

                <ScrollView contentContainerStyle={styles.arena}>
                    <View style={styles.diceContainer}>
                        <Dice result={topic} color={COLORS.lavenderPurple} />
                        <Typography variant="h1" style={styles.vs}>VS</Typography>
                        <Dice result={constraint} color={COLORS.vibrantPink} />
                    </View>

                    <SquishyButton 
                        onPress={rollDice} 
                        disabled={isRolling}
                        style={styles.rollButton}
                    >
                        <Typography variant="button" style={styles.buttonText}>
                            {isRolling ? 'ROLLING...' : 'ROLL DICE'}
                        </Typography>
                    </SquishyButton>
                </ScrollView>

                <LinearGradient
                    colors={[COLORS.mintGreen, COLORS.softViolet]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.hallOfFameSidebar}
                >
                    <Typography variant="h2" style={styles.sidebarTitle}>Hall of Fame</Typography>
                    {/* Fame items would be populated from state */}
                </LinearGradient>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.deepCosmic },
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
    refereeSidebar: { 
        width: 180, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    hallOfFameSidebar: { 
        width: 180, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    sidebarTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    refereeName: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    refereeQuote: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginTop: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    arena: { flex: 1, padding: SPACING.regular, alignItems: 'center', justifyContent: 'center' },
    diceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: SPACING.xxlarge },
    dice: { 
        width: 160, 
        height: 160, 
        borderRadius: BORDER_RADIUS.xxlarge * 2, 
        borderWidth: 4, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: SPACING.regular,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    diceIcon: { color: COLORS.textHint },
    diceText: { 
        color: COLORS.textPrimary, 
        marginTop: SPACING.regular, 
        textAlign: 'center', 
        textTransform: 'uppercase',
    },
    vs: { 
        color: COLORS.textHint,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xlarge,
    },
    rollButton: { 
        paddingVertical: SPACING.regular, 
        paddingHorizontal: SPACING.xlarge, 
        borderRadius: BORDER_RADIUS.xlarge,
        marginTop: SPACING.xlarge,
        ...SHADOWS.large,
    },
    buttonText: {
        color: COLORS.vibrantPink,
    },
});

export default ConflictDiceGameScreen;
