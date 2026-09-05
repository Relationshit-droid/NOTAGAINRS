import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const Star = ({ filled, onPress }: { filled: boolean, onPress: () => void }) => (
    <SquishyButton 
        title="★" 
        onPress={onPress} 
        size="small"
        style={[styles.star, {opacity: filled ? 1 : 0.2}]}
    />
);

const RateTheExperienceScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
        <ScreenLayout scrollable={true}>
            <GlassCard style={styles.contentContainer}>
                <Typography variant="displayLarge" style={styles.title}>RATE THE EXPERIENCE</Typography>
                <Typography variant="bodyMedium" style={styles.subtitle}>Your feedback helps us bring more love to the universe.</Typography>

                <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Star
                            key={index}
                            filled={index <= rating}
                            onPress={() => setRating(index)}
                        />
                    ))}
                </View>

                <TextInput
                    style={styles.textInput}
                    placeholder="TELL US MORE ABOUT YOUR SESSION... (OPTIONAL)"
                    placeholderTextColor={COLORS.textSecondary}
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                />

                <SquishyButton 
                    title="SUBMIT FEEDBACK 🚀" 
                    onPress={() => {}} 
                    style={styles.submitButton}
                />

                <SquishyButton 
                    title="MAYBE LATER" 
                    onPress={() => {}} 
                    variant="ghost"
                />
            </GlassCard>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        maxWidth: 640,
        alignItems: 'center',
    },
    title: {
        marginBottom: SPACING.small,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.xlarge,
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.xlarge,
    },
    star: {
        fontSize: TYPOGRAPHY.fontSize.displayLarge,
        color: COLORS.brightYellow,
        textShadowColor: COLORS.brightYellow,
        textShadowRadius: 8,
        marginHorizontal: SPACING.tiny,
    },
    textInput: {
        width: '100%',
        minHeight: 120,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 1,
        borderColor: COLORS.glowPink,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        textAlignVertical: 'top',
        marginBottom: SPACING.xlarge,
    },
    submitButton: {
        width: '100%',
        marginBottom: SPACING.regular,
    },
});

export default RateTheExperienceScreen;
