
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const StarRating = ({ rating, setRating }) => (
    <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(i => (
            <SquishyButton 
                key={i} 
                onPress={() => setRating(i)}
                variant="ghost"
                size="small"
                style={styles.starButton}
            >
                <Typography style={[styles.star, {opacity: i <= rating ? 1 : 0.2}]}>★</Typography>
            </SquishyButton>
        ))}
    </View>
);

const OptionButtons = ({ options, selected, setSelected }) => (
    <View style={styles.optionsContainer}>
        {options.map(option => (
            <SquishyButton
                key={option}
                variant={selected === option ? 'primary' : 'ghost'}
                size="small"
                onPress={() => setSelected(option)}
                style={styles.optionButton}
            >
                <Typography variant="button">{option}</Typography>
            </SquishyButton>
        ))}
    </View>
);

const RelationshipDiagnosisCard1 = () => {
    const [rating, setRating] = useState(0);
    const [resolution, setResolution] = useState(null);
    const [temperature, setTemperature] = useState(0.5);

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <Typography variant="h1" center style={styles.header}>EMOTIONAL RE-ENTRY</Typography>
            <Typography variant="label" center color={COLORS.textSecondary} style={styles.subHeader}>
                A QUICK ALIGNMENT CHECK BEFORE WE CONCLUDE.
            </Typography>

            <GlassCard style={styles.glassPanel}>
                <View style={styles.questionBlock}>
                    <Typography variant="h3" style={styles.questionText}>1. DO YOU FEEL HEARD BY YOUR PARTNER?</Typography>
                    <StarRating rating={rating} setRating={setRating} />
                </View>

                <View style={styles.questionBlock}>
                    <Typography variant="h3" style={styles.questionText}>2. IS THE INITIAL TENSION RESOLVED?</Typography>
                    <OptionButtons options={['COMPLETELY', 'MOSTLY', 'A LITTLE', 'NOT REALLY']} selected={resolution} setSelected={setResolution} />
                </View>

                <View style={styles.questionBlock}>
                    <Typography variant="h3" style={styles.questionText}>3. CURRENT EMOTIONAL TEMPERATURE?</Typography>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={temperature}
                        onValueChange={setTemperature}
                        minimumTrackTintColor={COLORS.info}
                        maximumTrackTintColor={COLORS.borderSubtle}
                        thumbTintColor={COLORS.info}
                    />
                     <View style={styles.sliderLabels}>
                        <Typography variant="caption" color={COLORS.textSecondary}>COOL / DISTANT</Typography>
                        <Typography variant="caption" color={COLORS.textSecondary}>WARM / CONNECTED</Typography>
                    </View>
                </View>
            </GlassCard>

            <SquishyButton 
                style={styles.finishButton}
                onPress={() => {}}
            >
                <Typography variant="button">FINISH SOS SESSION</Typography>
                <Typography>✅</Typography>
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        marginTop: SPACING.large,
        textTransform: 'uppercase' 
    },
    subHeader: { 
        marginBottom: SPACING.large,
        textTransform: 'uppercase' 
    },
    glassPanel: { 
        width: '100%',
        marginBottom: SPACING.xlarge,
    },
    questionBlock: { 
        marginBottom: SPACING.xxlarge 
    },
    questionText: { 
        marginBottom: SPACING.regular,
        textTransform: 'uppercase' 
    },
    starContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: SPACING.small 
    },
    starButton: {
        width: 50,
        height: 50,
        minHeight: 50,
    },
    star: { 
        fontSize: TYPOGRAPHY.fontSize.displayMedium, 
        color: COLORS.brightYellow,
    },
    optionsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: SPACING.small 
    },
    optionButton: {
        marginVertical: SPACING.tiny,
    },
    slider: { 
        width: '100%', 
        height: 40 
    },
    sliderLabels: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: SPACING.small 
    },
    finishButton: { 
        marginTop: SPACING.xlarge,
        alignSelf: 'center',
    },
});

export default RelationshipDiagnosisCard1;
