
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const verdictData = {
    alex: {
        lens: 'DEFENSIVE SHIELD',
        quote: "I feel like I'm constantly being audited for every small mistake, which makes me want to withdraw entirely to avoid more criticism.",
        emotions: ['SUFFOCATED', 'UNDERVALUED']
    },
    jordan: {
        lens: 'THE NEED FOR ORDER',
        quote: "If I don't point things out, they just don't get done. It feels like I'm a manager, not a partner.",
        emotions: ['ISOLATED', 'OVERBURDENED']
    },
    reality: {
        title: "YOU'RE BOTH ARGUING ABOUT THE DISHES BECAUSE NEITHER OF YOU FEELS SEEN.",
        points: ['OVERLAP: FEAR OF ABANDONMENT', 'CORE ISSUE: RESPECT VS. AUTONOMY']
    },
    marciesRoast: "Alex, your 'withdrawal' isn't peace, it's a strategic ghosting. And Jordan, your 'reminders' are just corporate emails with more attitude. You're both acting like roommates who met on a bad Craigslist ad.",
    stingMeter: '9.8/10'
};

type PerspectiveCardProps = {
    person: string;
    data: { lens: string; quote: string; emotions: string[] };
    color: string;
};

const PerspectiveCard = ({ person, data, color }: PerspectiveCardProps) => (
    <GlassCard style={[styles.panelGlass, { borderLeftWidth: 4, borderLeftColor: color }]}>
        <Typography variant="h3" style={styles.personName}>{person}'S LENS</Typography>
        <Typography variant="label" style={[styles.personLens, { color }]}>{data.lens}</Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.personQuote}>{data.quote}</Typography>
        <Typography variant="caption" color={COLORS.textSecondary} style={styles.primaryEmotion}>PRIMARY EMOTION</Typography>
        <View style={styles.emotionsContainer}>
            {data.emotions.map(e => (
                <GlassCard key={e} padding="small" style={styles.emotionTag}>
                    <Typography variant="caption">{e}</Typography>
                </GlassCard>
            ))}
        </View>
    </GlassCard>
);

const RelationshipDiagnosisCard2 = () => {

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <Typography variant="h1" center>
                THE <Typography variant="h1" color={COLORS.vibrantPink} style={styles.headerHighlight}>"TOUGH LOVE"</Typography> VERDICT
            </Typography>
            <Typography variant="label" center color={COLORS.textSecondary} style={styles.subHeader}>
                I'VE CRUNCHED THE FEELINGS. HERE'S THE DEAL.
            </Typography>

            <View style={styles.cardsContainer}>
                <PerspectiveCard person="ALEX" data={verdictData.alex} color={COLORS.info} />
                
                <GlassCard variant="elevated" style={styles.realityCard}>
                    <Typography variant="label" color={COLORS.vibrantPink} style={styles.realityTitle}>THE REALITY</Typography>
                    <Typography variant="h2" color={COLORS.backgroundPrimary} style={styles.realityText}>{verdictData.reality.title}</Typography>
                     {verdictData.reality.points.map(p => (
                        <View key={p} style={styles.realityPoint}>
                            <Typography>✅</Typography>
                            <Typography variant="body" color={COLORS.backgroundPrimary} style={styles.realityPointText}>{p}</Typography>
                        </View>
                    ))}
                </GlassCard>

                <PerspectiveCard person="JORDAN" data={verdictData.jordan} color={COLORS.lavenderPurple} />
            </View>

            <GlassCard style={[styles.roastContainer, { borderColor: COLORS.vibrantPink }]}>
                <Typography variant="label" color={COLORS.vibrantPink} style={styles.roastTitle}>MARCIE'S ROAST</Typography>
                <Typography variant="h2" color={COLORS.vibrantPink} center style={styles.roastText}>{verdictData.marciesRoast}</Typography>
                <GlassCard padding="small" style={styles.stingMeter}>
                   <Typography variant="caption" color={COLORS.textSecondary}>STING METER</Typography>
                   <Typography variant="h2" color={COLORS.brightYellow}>{verdictData.stingMeter}</Typography>
                </GlassCard>
            </GlassCard>

            <View style={styles.buttonContainer}>
                <SquishyButton onPress={() => {}}>
                    <Typography variant="button">START HEALING EXERCISE</Typography>
                </SquishyButton>
                <SquishyButton variant="ghost" onPress={() => {}}>
                    <Typography variant="button">RE-EXAMINE PERSPECTIVES</Typography>
                </SquishyButton>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    headerHighlight: { 
        fontStyle: 'italic' 
    },
    subHeader: { 
        marginBottom: SPACING.xlarge,
        textTransform: 'uppercase',
    },
    cardsContainer: { 
        marginBottom: SPACING.xlarge, 
        gap: SPACING.regular 
    },
    panelGlass: { 
        marginBottom: SPACING.regular,
    },
    personName: { 
        textTransform: 'uppercase' 
    },
    personLens: { 
        textTransform: 'uppercase',
        marginBottom: SPACING.medium,
    },
    personQuote: { 
        fontStyle: 'italic', 
        marginBottom: SPACING.medium 
    },
    primaryEmotion: { 
        textTransform: 'uppercase',
        marginBottom: SPACING.small,
    },
    emotionsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: SPACING.small 
    },
    emotionTag: {
        backgroundColor: COLORS.backgroundPrimary,
    },
    realityCard: { 
        backgroundColor: COLORS.textPrimary,
        marginVertical: SPACING.regular,
        transform: [{ scale: 1.05 }],
        borderWidth: 2,
        borderColor: COLORS.vibrantPink,
    },
    realityTitle: { 
        textTransform: 'uppercase',
        marginBottom: SPACING.medium,
    },
    realityText: { 
        marginBottom: SPACING.medium,
        textTransform: 'uppercase' 
    },
    realityPoint: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginBottom: SPACING.tiny 
    },
    realityPointText: { 
        textTransform: 'uppercase' 
    },
    roastContainer: { 
        borderWidth: 1,
        padding: SPACING.xlarge,
        alignItems: 'center' 
    },
    roastTitle: { 
        textTransform: 'uppercase',
        marginBottom: SPACING.medium,
        alignSelf: 'flex-start' 
    },
    roastText: { 
        textShadowColor: COLORS.glowPink,
        textShadowRadius: 15,
        marginBottom: SPACING.large 
    },
    stingMeter: {
        alignItems: 'center',
        backgroundColor: COLORS.backgroundInput,
    },
    buttonContainer: { 
        marginTop: SPACING.xxlarge, 
        gap: SPACING.regular 
    },
});

export default RelationshipDiagnosisCard2;
