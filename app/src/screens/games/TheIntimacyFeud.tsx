
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const TheIntimacyFeud = () => {
    const [answers, setAnswers] = useState(Array(5).fill(null));
    const [strikes, setStrikes] = useState(1);
    const [guess, setGuess] = useState('');

    const handleGuess = () => {
        // Dummy check, in a real app this would be validated against a list
        if (guess.toLowerCase().includes('cuddle')) {
            const newAnswers = [...answers];
            newAnswers[0] = 'More Cuddles';
            setAnswers(newAnswers);
        } else {
            setStrikes(s => (s < 3 ? s + 1 : 3));
        }
        setGuess('');
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.deepCosmic]} style={styles.container}>
                <Typography variant="h1" center style={styles.header}>The Intimacy Feud</Typography>
                <Typography variant="body" center style={styles.prompt}>
                    A secret desire your partner finally shared
                </Typography>

                <View style={styles.board}>
                    {answers.map((answer, index) => (
                        <GlassCard key={index} style={styles.slot} variant="elevated">
                            <Typography variant="body">{answer || '[ Locked ]'}</Typography>
                            {answer ? null : <MaterialIcons name="lock" size={24} color={COLORS.textHint} />}
                        </GlassCard>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a secret desire..."
                        placeholderTextColor={COLORS.textHint}
                        value={guess}
                        onChangeText={setGuess}
                    />
                    <SquishyButton onPress={handleGuess} size="small" style={styles.sendButton}>
                        <MaterialIcons name="send" size={24} color={COLORS.textPrimary} />
                    </SquishyButton>
                </View>

                <View style={styles.strikesContainer}>
                    {[1, 2, 3].map(i => (
                        <GlassCard 
                            key={i} 
                            style={[styles.strike, i <= strikes && styles.strikeActive]}
                        >
                            <MaterialIcons 
                                name="close" 
                                size={32} 
                                color={i <= strikes ? COLORS.textPrimary : COLORS.textDisabled} 
                            />
                        </GlassCard>
                    ))}
                </View>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        padding: SPACING.screenPadding, 
        justifyContent: 'center' 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundSecondary,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: { 
        color: COLORS.vibrantPink, 
        marginBottom: SPACING.small 
    },
    prompt: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge 
    },
    board: { 
        width: '100%', 
        gap: SPACING.medium, 
        marginBottom: SPACING.xxlarge 
    },
    slot: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: SPACING.regular, 
    },
    inputContainer: { 
        flexDirection: 'row', 
        width: '100%', 
        marginBottom: SPACING.xlarge 
    },
    input: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundCard, 
        padding: SPACING.regular, 
        borderTopLeftRadius: BORDER_RADIUS.large, 
        borderBottomLeftRadius: BORDER_RADIUS.large, 
        color: COLORS.textPrimary, 
        fontSize: TYPOGRAPHY.fontSize.bodyLarge 
    },
    sendButton: { 
        borderTopLeftRadius: 0, 
        borderBottomLeftRadius: 0,
        borderTopRightRadius: BORDER_RADIUS.large, 
        borderBottomRightRadius: BORDER_RADIUS.large,
    },
    strikesContainer: { 
        flexDirection: 'row', 
        gap: SPACING.large 
    },
    strike: { 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle 
    },
    strikeActive: { 
        backgroundColor: COLORS.warmOrange, 
        borderColor: COLORS.warmOrange 
    },
});

export default TheIntimacyFeud;
