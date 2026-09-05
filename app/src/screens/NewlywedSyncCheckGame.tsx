import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const PlayerCard = ({ partner, name, answer, color }: { partner: string, name: string, answer: string, color: string }) => (
    <GlassCard style={[styles.playerCard, { borderColor: color }]}>
        <View style={styles.playerHeader}>
            <View style={[styles.avatar, { borderColor: color }]} />
            <View>
                <Typography variant="label" style={[styles.partnerLabel, { color }]}>{`PARTNER ${partner}`}</Typography>
                <Typography variant="bodyMedium" style={styles.playerName}>{name}</Typography>
            </View>
        </View>
        <Typography variant="displaySmall" style={styles.answerText}>{`"${answer}"`}</Typography>
    </GlassCard>
);

const NewlywedSyncCheckGame = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="displaySmall" style={styles.questionText}>WHERE IS YOUR PARTNER'S 'HAPPY PLACE'?</Typography>

            <View style={styles.syncArea}>
                <PlayerCard partner="A" name="ALEX CHEN" answer="The Beach" color={COLORS.vibrantPink} />
                <View style={styles.matchIndicator}>
                    <Typography variant="displayMedium" style={styles.matchPercent}>94%</Typography>
                    <Typography variant="label" style={styles.matchLabel}>MATCH</Typography>
                </View>
                <PlayerCard partner="B" name="JORDAN SMITH" answer="Under a palm tree" color={COLORS.lavenderPurple} />
            </View>

            <GlassCard style={styles.critiqueContainer}>
                <Typography variant="label" style={styles.critiqueTitle}>THE EXPERT'S TAKE</Typography>
                <Typography variant="bodyMedium" style={styles.critiqueText}>"Technically a match, but let's be real—Alex wants the mojito and Jordan just wants the shade."</Typography>
            </GlassCard>

            <View style={styles.buttonContainer}>
                <SquishyButton title="REVIEW LOGIC" onPress={() => {}} variant="secondary" />
                <SquishyButton title="NEXT QUESTION" onPress={() => {}} />
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    questionText: { 
        textAlign: 'center', 
        marginVertical: SPACING.xlarge, 
        textTransform: 'uppercase' 
    },
    syncArea: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        width: '100%', 
        paddingHorizontal: SPACING.small 
    },
    playerCard: { 
        flex: 1, 
        minHeight: 180, 
        marginHorizontal: SPACING.small 
    },
    playerHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: SPACING.regular 
    },
    avatar: { 
        width: 40, 
        height: 40, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2 
    },
    partnerLabel: { 
        textTransform: 'uppercase' 
    },
    playerName: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    answerText: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic', 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    matchIndicator: { 
        width: 100, 
        height: 100, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: COLORS.vibrantPink 
    },
    matchPercent: { 
        color: COLORS.vibrantPink 
    },
    matchLabel: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase' 
    },
    critiqueContainer: { 
        marginTop: SPACING.xlarge, 
        marginHorizontal: SPACING.regular 
    },
    critiqueTitle: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.small 
    },
    critiqueText: { 
        color: COLORS.textSecondary, 
        fontStyle: 'italic' 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        marginTop: SPACING.xlarge, 
        width: '100%', 
        justifyContent: 'space-around' 
    },
});

export default NewlywedSyncCheckGame;
