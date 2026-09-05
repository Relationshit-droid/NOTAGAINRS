import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const initialAnswers = [
    { text: 'Active Listening', score: 42, revealed: true },
    { text: 'No Interruption', score: 28, revealed: true },
    { text: 'Soft Tone', score: 15, revealed: true },
    { text: '??????????', score: 0, revealed: false },
    { text: '??????????', score: 0, revealed: false },
    { text: '??????????', score: 0, revealed: false },
];

const SafetyAndEmpathyFeud = () => {
    const [answers, setAnswers] = useState(initialAnswers);
    const [strikes, setStrikes] = useState(2);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <View style={styles.container}>
                <GlassCard style={styles.headerContainer}>
                    <Typography variant="h2" center style={styles.titleText}>"Things that make me feel safe during a talk"</Typography>
                    <Typography variant="caption" center style={styles.subtitleText}>Survey Says...</Typography>
                </GlassCard>

                <View style={styles.gameLayout}>
                    <View style={styles.gameBoardContainer}>
                        {answers.map((answer, index) => (
                            <View key={index} style={styles.answerRow}>
                                <GlassCard style={[styles.answerBox, answer.revealed && styles.revealedBox]}>
                                    <Typography variant="caption" style={styles.answerIndex}>{index + 1}</Typography>
                                    <Typography variant="body" style={styles.answerText}>{answer.text}</Typography>
                                    {answer.revealed && <Typography variant="caption" style={styles.answerScore}>{answer.score}</Typography>}
                                </GlassCard>
                            </View>
                        ))}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Type your guess here..."
                                placeholderTextColor={COLORS.textSecondary}
                            />
                            <MaterialIcons name="send" size={24} color={COLORS.error} style={styles.sendIcon} />
                        </View>
                        <View style={styles.strikeContainer}>
                            {[...Array(3)].map((_, i) => (
                                <Typography key={i} variant="h1" style={[styles.strike, i < strikes && styles.activeStrike]}>X</Typography>
                            ))}
                        </View>
                    </View>

                    <View style={styles.hostContainer}>
                        <GlassCard style={styles.speechBubble}>
                            <Typography variant="sass">"Honey, your empathy is buffering... try again, but with actual feeling this time."</Typography>
                        </GlassCard>
                        <Typography variant="h3" center>Dr. Marcie Liss</Typography>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.screenPadding
    },
    headerContainer: { 
        padding: SPACING.large, 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    titleText: {
        color: COLORS.error
    },
    subtitleText: {
        marginTop: SPACING.small
    },
    gameLayout: { 
        flexDirection: 'row', 
        gap: SPACING.xlarge 
    },
    gameBoardContainer: { 
        flex: 3 
    },
    answerRow: { 
        marginBottom: SPACING.tiny 
    },
    answerBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: SPACING.regular, 
        height: 50 
    },
    revealedBox: { 
        backgroundColor: COLORS.backgroundCard 
    },
    answerIndex: { 
        color: COLORS.error, 
        marginRight: SPACING.regular 
    },
    answerText: { 
        flex: 1 
    },
    answerScore: { 
        color: COLORS.error 
    },
    inputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: SPACING.large 
    },
    textInput: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundCard, 
        borderWidth: 2, 
        borderColor: COLORS.error, 
        borderRadius: BORDER_RADIUS.medium, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary 
    },
    sendIcon: {
        position: 'absolute',
        right: SPACING.regular
    },
    strikeContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: SPACING.xlarge, 
        marginTop: SPACING.large 
    },
    strike: { 
        color: COLORS.backgroundCard 
    },
    activeStrike: { 
        color: COLORS.error 
    },
    hostContainer: { 
        flex: 1, 
        justifyContent: 'flex-end', 
        alignItems: 'center' 
    },
    speechBubble: { 
        marginBottom: SPACING.regular 
    },
});

export default SafetyAndEmpathyFeud;
