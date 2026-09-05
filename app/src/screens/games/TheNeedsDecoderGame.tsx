
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const options = [
    'Quiet + Caffeine + Support',
    'Sleepy + Drink + Walk',
    'Stormy + Breakfast + Responsibility',
];

const TheNeedsDecoderGame = () => {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundSecondary]} style={styles.container}>
                <Typography variant="h1" center>The Needs Decoder</Typography>
                <Typography variant="body" center style={styles.subHeader}>Partner A sent:</Typography>

                <View style={styles.emojiContainer}>
                    <Typography variant="h1" style={styles.emoji}>☁️</Typography>
                    <Typography variant="h1" style={styles.emoji}>☕</Typography>
                    <Typography variant="h1" style={styles.emoji}>🐕</Typography>
                </View>

                <View style={styles.optionsContainer}>
                    {options.map((option, i) => (
                        <GlassCard 
                            key={i} 
                            onPress={() => setSelected(i)}
                            style={[styles.option, selected === i && styles.selectedOption]}
                            variant={selected === i ? 'default' : 'outlined'}
                        >
                            <Typography variant="body">{option}</Typography>
                            {selected === i && <MaterialIcons name="check-circle" size={24} color={COLORS.vibrantPink} />}
                        </GlassCard>
                    ))}
                </View>

                <SquishyButton onPress={() => {}} size="large" style={styles.submitButton}>
                    <Typography variant="button">SUBMIT DECODING</Typography>
                </SquishyButton>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: SPACING.screenPadding 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subHeader: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.small, 
        marginBottom: SPACING.xlarge 
    },
    emojiContainer: { 
        flexDirection: 'row', 
        gap: SPACING.xlarge, 
        marginBottom: SPACING.xxlarge 
    },
    emoji: { 
        fontSize: TYPOGRAPHY.fontSize.displayMedium 
    },
    optionsContainer: { 
        width: '100%', 
        gap: SPACING.medium, 
        marginBottom: SPACING.xxlarge 
    },
    option: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: SPACING.regular, 
    },
    selectedOption: { 
        backgroundColor: COLORS.backgroundInput, 
        borderColor: COLORS.vibrantPink 
    },
    submitButton: { 
        width: '100%' 
    },
});

export default TheNeedsDecoderGame;
