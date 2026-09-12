
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const repairOptions = [
    { id: 'hug', title: '6-SECOND HUG', description: 'Release oxytocin and ground each other through physical presence.', category: 'PHYSICAL CONNECTION', icon: '🤗', color: COLORS.brightYellow },
    { id: 'apology', title: 'DIRECT APOLOGY', description: 'Take ownership of your part in the friction with zero justifications.', category: 'VULNERABILITY', icon: '🙏', color: COLORS.info },
    { id: 'listening', title: 'ACTIVE LISTENING', description: 'Hold space for their perspective without planning your response.', category: 'EMPATHY', icon: '🎧', color: COLORS.peachOrange },
    { id: 'humor', title: 'SILLY HUMOR', description: 'Crack the tension with an inside joke or a lighthearted observation.', category: 'PLAYFULNESS', icon: '😜', color: COLORS.lavenderPurple },
];

type ChoiceOption = {
    id: string;
    color: string;
    icon: string;
    title: string;
    description: string;
};

type ChoiceCardProps = {
    option: ChoiceOption;
    isSelected: boolean;
    onSelect: (id: string) => void;
};

const ChoiceCard = ({ option, isSelected, onSelect }: ChoiceCardProps) => (
    <SquishyButton 
        variant={isSelected ? 'primary' : 'ghost'}
        onPress={() => onSelect(option.id)}
        style={[styles.choiceCard, isSelected && { borderColor: option.color, borderWidth: 2 }]}
    >
        <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
            <Typography style={{fontSize: TYPOGRAPHY.fontSize.displaySmall}}>{option.icon}</Typography>
        </View>
        <Typography variant="h3" center style={styles.cardTitle}>{option.title}</Typography>
        <Typography variant="body" center color={COLORS.textSecondary} style={styles.cardDescription}>{option.description}</Typography>
        <View style={styles.cardFooter}>
            <Typography variant="caption" style={[styles.cardCategory, { color: option.color }]}>{option.category}</Typography>
        </View>
    </SquishyButton>
);

const RelationshipDiagnosisCard3 = () => {
    const [selectedOption, setSelectedOption] = useState(repairOptions[0].id);

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <Typography variant="h1" center style={styles.header}>CHOOSE YOUR PEACE OFFERING</Typography>
            <Typography variant="label" center color={COLORS.textSecondary} style={styles.subHeader}>
                SELECT A REPAIR ATTEMPT TO REALIGN YOUR ORBITS AND RESTORE HARMONY.
            </Typography>

            <View style={styles.cardsContainer}>
                {repairOptions.map(option => (
                    <ChoiceCard 
                        key={option.id} 
                        option={option} 
                        isSelected={selectedOption === option.id} 
                        onSelect={setSelectedOption} 
                    />
                ))}
            </View>

            <SquishyButton onPress={() => {}} style={styles.mainButton}>
                <Typography variant="button">CHOOSE THIS PATH</Typography>
                <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>✨</Typography>
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        marginBottom: SPACING.small,
        textTransform: 'uppercase' 
    },
    subHeader: { 
        marginBottom: SPACING.xlarge,
        maxWidth: 600, 
        alignSelf: 'center',
        textTransform: 'uppercase',
    },
    cardsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xxlarge 
    },
    choiceCard: {
        alignItems: 'center',
        width: '46%',
        paddingVertical: SPACING.xlarge,
        paddingHorizontal: SPACING.regular,
    },
    iconContainer: { 
        width: 64, 
        height: 64, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: SPACING.regular 
    },
    cardTitle: { 
        marginBottom: SPACING.small,
        textTransform: 'uppercase' 
    },
    cardDescription: { 
        marginBottom: SPACING.regular 
    },
    cardFooter: { 
        borderTopWidth: 1, 
        borderTopColor: COLORS.borderSubtle,
        paddingTop: SPACING.medium, 
        width: '100%', 
        alignItems: 'center' 
    },
    cardCategory: { 
        textTransform: 'uppercase',
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    },
    mainButton: { 
        alignSelf: 'center' 
    },
});

export default RelationshipDiagnosisCard3;
