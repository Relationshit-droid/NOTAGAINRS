import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const VowRemixGame = () => {
    const [vowText, setVowText] = useState('');
    const [clarity, setClarity] = useState(5);

    return (
        <ScreenLayout showHeader={true} scrollable={true}>
            <View style={styles.header}>
                <Typography variant="h1" center>Vow Remix</Typography>
                <Typography variant="h2" center>Creative Writing Phase</Typography>
            </View>

            <GlassCard style={styles.card}>
                <Typography variant="h3" style={styles.vowTitle}>I vow to...</Typography>
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Write your current reality here..."
                    placeholderTextColor={COLORS.textHint}
                    value={vowText}
                    onChangeText={setVowText}
                />
            </GlassCard>

            <View style={styles.sliderContainer}>
                <Typography variant="label">Clarity: {clarity.toFixed(1)}</Typography>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={0.1}
                    value={clarity}
                    onValueChange={setClarity}
                    minimumTrackTintColor={COLORS.vibrantPink}
                    maximumTrackTintColor={COLORS.rosePink}
                    thumbTintColor={COLORS.vibrantPink}
                />
            </View>

            <SquishyButton onPress={() => {}} style={styles.submitButton}>
                <MaterialIcons name="send" size={24} color={COLORS.textPrimary} />
                <Typography variant="button" style={styles.buttonText}>Submit Vow</Typography>
            </SquishyButton>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.card,
        padding: SPACING.xlarge,
        ...SHADOWS.card,
        minHeight: 300
    },
    textInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyLarge,
        textAlignVertical: 'top',
        lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.5,
        fontFamily: TYPOGRAPHY.fontFamily.regular,
    },
    sliderContainer: { 
        width: '100%', 
        alignItems: 'center', 
        marginVertical: SPACING.xlarge,
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large
    },
    submitButton: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.vibrantPink, 
        paddingHorizontal: SPACING.xxlarge, 
        paddingVertical: SPACING.regular, 
        borderRadius: BORDER_RADIUS.button, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    vowTitle: {
        marginBottom: SPACING.regular,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    buttonText: {
        marginLeft: SPACING.small,
    },
});

export default VowRemixGame;
