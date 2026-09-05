import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Typography } from '../../components/ui';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';

const DreamDecoderGameScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Typography variant="h1" center>The Love Arcade</Typography>
                        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
                    </View>

                    <View style={styles.mainLayout}>
                        {/* Left Panel - Dr. Marcie */}
                        <View style={styles.leftPanel}>
                            <View style={styles.drMarcieImage} />
                            <GlassCard style={styles.speechBubble}>
                                <Typography variant="body">"Not about dishes, darling. It's about feeling seen."</Typography>
                            </GlassCard>
                        </View>

                        {/* Right Panel - Game */}
                        <View style={styles.rightPanel}>
                            <GlassCard>
                                <Typography variant="caption">Core Conflict Identification</Typography>
                                <Typography variant="h2">Surface Conflict: <Typography variant="body" style={styles.highlightText}>Dishes in Sink</Typography></Typography>
                                <Typography variant="body" style={styles.cardBody}>The surface fight is about chores, but what lies beneath? Provide clues to help your partner decode the hidden dream.</Typography>
                                <TextInput 
                                    style={styles.clueInput} 
                                    placeholder="e.g., 'Validation', 'Balance', 'Time'..." 
                                    placeholderTextColor={COLORS.textHint}
                                />
                                <SquishyButton onPress={() => {}}>
                                    <Typography variant="button">Submit Clue</Typography>
                                </SquishyButton>
                            </GlassCard>

                            <View style={styles.hintCardsContainer}>
                                <GlassCard style={styles.hintCard}>
                                    <Typography variant="caption">Partner's Last Guess</Typography>
                                    <Typography variant="body" style={styles.hintText}>"Is it about needing more help?"</Typography>
                                </GlassCard>
                                <GlassCard style={[styles.hintCard, styles.hintCardDimmed]}>
                                    <Typography variant="caption">Dream Unlock</Typography>
                                    <Typography variant="body" style={styles.hintText}>Waiting for 3 clues...</Typography>
                                </GlassCard>
                            </View>
                        </View>
                    </View>
                </ScrollView>

        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    highlightText: {
        color: COLORS.brightYellow,
    },
    hintCardDimmed: {
        opacity: 0.5,
    },
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundSecondary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    scrollContainer: { 
        padding: SPACING.screenPadding 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xxlarge 
    },
    mainLayout: { 
        flexDirection: 'row', 
        gap: SPACING.xlarge 
    },
    leftPanel: { 
        flex: 1, 
        alignItems: 'center' 
    },
    drMarcieImage: { 
        width: 200, 
        height: 260, 
        borderRadius: BORDER_RADIUS.xlarge, 
        backgroundColor: COLORS.backgroundCard, 
        borderWidth: 1, 
        borderColor: COLORS.vibrantPink 
    },
    speechBubble: { 
        marginTop: -SPACING.xlarge, 
        marginRight: -SPACING.xxlarge, 
        transform: [{ rotate: '3deg' }]
    },
    rightPanel: { 
        flex: 2, 
        gap: SPACING.regular 
    },
    cardBody: { 
        marginVertical: SPACING.regular 
    },
    clueInput: { 
        backgroundColor: COLORS.backgroundInput, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle, 
        borderRadius: BORDER_RADIUS.input, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        fontSize: TYPOGRAPHY.fontSize.bodyLarge, 
        marginBottom: SPACING.regular 
    },
    hintCardsContainer: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    hintCard: { 
        flex: 1 
    },
    hintText: { 
        fontStyle: 'italic',
        marginTop: SPACING.small
    },
});

export default DreamDecoderGameScreen;
