
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

type PartnerCardProps = {
    partner: string;
    answer: string;
    color: string;
    avatar: string;
    align: 'left' | 'right';
};

const PartnerCard = ({ partner, answer, color, avatar, align }: PartnerCardProps) => (
    <View style={styles.cardContainer}>
        <GlassCard style={[styles.card, { borderColor: `${color}80`, alignItems: align === 'left' ? 'flex-start' : 'flex-end' }]}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Typography variant="h1" style={[styles.answerText, { color }]}>{answer}</Typography>
            <Typography variant="caption" color={COLORS.textHint} style={styles.partnerLabel}>{partner}</Typography>
        </GlassCard>
    </View>
);

const TranslatorActionPlan9 = () => {

    const question = "Who is the better driver?";
    const partner1 = { name: 'Partner 1', answer: 'ME', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAJA0w-6d6olkTsMYKG8VlcOuiZohvhxv-0kIltZ6E2RuIaOBCPCadOD7maCtRAUWzQ1s1UeoigCsx4y6Fw__gxH2mwM6oDUSFc3X2QbkPyuJ5I-gTurhLnGInmdt29TFjxFPRq-AOjefIZ3CntF6vHycq0xeoCLyAllLWJV_xJMEtZmAYxz9mbhI4BcqfJvpf8GX5cr_vsDEzj6pS3ctSWkqtF7P6SJgWCbZItKtwuzboCOPtHTyA3u9sV7QgqjhTJht2RqDAi-MK' };
    const partner2 = { name: 'Partner 2', answer: 'HER', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-1Te1BiX9bhVJ24w0-1dtVgVmdhrU0ek4P7BU_Vi72i4LSwFor63vGyvAYuYuCpUtx3o5lO7cxa53uSCroE-PbMW64L4gxD48V-L6RgrpP6Rh9b3gextPA2O_TQktRbBqI8RqdLyWmF9yUf_jRfXAD79kaqkX6GVhUZl0jj0nOGsTNyfOLfIeH80TxTqnrgbu_4ek6lPtz4ortyW0rG0rIyo_o6he3ieduWDBmRbX_d9Vu0sYMESrBxXhLvfYs5m4WFpwiAWw7vz' };
    const roast = "Ouch! Someone's living in a fantasy world. Those parking tickets don't lie, Mark!";

    return (
        <ScreenLayout scrollable={true} showHeader={false} contentStyle={styles.contentContainer}>
            <Typography variant="label" color={COLORS.textSecondary} style={styles.header}>The Big Reveal</Typography>
            <GlassCard style={styles.questionContainer}>
                <Typography variant="h3" style={styles.questionText}>"{question}"</Typography>
            </GlassCard>
            
            <View style={styles.revealContainer}>
                <PartnerCard partner={partner1.name} answer={partner1.answer} color={COLORS.mintGreen} avatar={partner1.avatar} align="left" />
                
                <View style={styles.roastContainer}>
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk_aTW4MbpEPoKcJ7J9so5udKgmhztqFRhZlMjXwaxZBzYUy_CH85HG2QoeY7emOh1vfFmFpUaHFnfHrt2hJr4-XFvHLEo8zvyZFyO9OGdoxmiejXbj03jL_TGGQ0sOi7proHpxNQZ2sShaAYaracCiwyMl4XmuH9rlNHonxAU-zD3JStjlsROVzqY-E9fXfWvCF03hpWY_UW-E1EeejiVUtn3vv7HCgMS2WQEjPXGaKHdCiSOIhlzbUFxjCijfhvqgImA-KzTH4Im' }} style={styles.hostAvatar} />
                    <GlassCard variant="elevated" style={styles.speechBubble}>
                        <Typography variant="body" color={COLORS.backgroundPrimary} style={styles.roastText}>{roast}</Typography>
                    </GlassCard>
                    <GlassCard padding="small" style={styles.syncScore}>
                        <Typography variant="caption" color={COLORS.vibrantPink} style={styles.syncText}>MISMATCH</Typography>
                    </GlassCard>
                </View>
                
                <PartnerCard partner={partner2.name} answer={partner2.answer} color={COLORS.rosePink} avatar={partner2.avatar} align="right" />
            </View>

            <SquishyButton onPress={() => {}} style={styles.nextButton}>
                <Typography variant="button">Next Question</Typography>
                <MaterialIcons name="arrow-forward" size={20} color={COLORS.textPrimary} />
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'space-around',
    },
    header: { 
        textTransform: 'uppercase', 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
        marginBottom: SPACING.regular,
        textAlign: 'center',
    },
    questionContainer: { 
        backgroundColor: `${COLORS.backgroundSecondary}80`,
        marginBottom: SPACING.xlarge,
    },
    questionText: { 
        fontStyle: 'italic',
        textAlign: 'center',
    },
    revealContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%' 
    },
    cardContainer: { 
        flex: 1, 
        padding: SPACING.tiny 
    },
    card: { 
        height: 250, 
        borderWidth: 2, 
        justifyContent: 'center', 
        padding: SPACING.regular 
    },
    avatar: { 
        width: 80, 
        height: 80, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle, 
        alignSelf: 'center', 
        marginBottom: SPACING.regular 
    },
    answerText: { 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    partnerLabel: { 
        textAlign: 'center', 
        marginTop: SPACING.small 
    },
    roastContainer: { 
        alignItems: 'center', 
        marginHorizontal: -SPACING.large, 
        zIndex: 1 
    },
    hostAvatar: { 
        width: 120, 
        height: 120, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 3, 
        borderColor: COLORS.vibrantPink 
    },
    speechBubble: { 
        backgroundColor: COLORS.textPrimary,
        marginTop: -SPACING.xlarge,
        zIndex: -1 
    },
    roastText: { 
        textAlign: 'center' 
    },
    syncScore: { 
        backgroundColor: COLORS.backgroundPrimary,
        marginTop: SPACING.regular,
    },
    syncText: { 
        fontWeight: 'bold' 
    },
    nextButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: SPACING.xlarge,
    },
});

export default TranslatorActionPlan9;
