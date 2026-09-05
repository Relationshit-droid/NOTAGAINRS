import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const DefensivenessDetoxGameScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Typography variant="h1" center>Identify the Trigger</Typography>
                    <Typography variant="body" center style={styles.headerSubtitle}>Express your frustration. Let's find a softer way to say it.</Typography>
                </View>

                <View style={styles.gameGrid}>
                    {/* Left Panel */}
                    <GlassCard style={styles.glassPanel} padding="large">
                        <Typography variant="h3" style={styles.panelTitle}>The Complaint: Speak Your Mind</Typography>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="e.g., You always forget to do the dishes..."
                            placeholderTextColor={COLORS.textHint}
                            defaultValue="You always forget to do the dishes when it's your turn. It makes me feel like I have to do everything around here."
                        />
                    </GlassCard>

                    {/* Right Panel */}
                    <GlassCard style={styles.glassPanel} padding="large">
                        <Typography variant="h3" style={styles.panelTitle}>The Analysis: The Heart View</Typography>
                        <View style={styles.analysisBox}>
                            <Typography variant="body">
                                <Typography variant="body" style={styles.highlightedText}>"You always"</Typography>
                                <Typography variant="body"> forget to do the dishes...</Typography>
                            </Typography>
                        </View>
                        <View style={styles.drMarcieContainer}>
                             {/* Image Placeholder */}
                            <View style={styles.drMarcieAvatar} />
                            <GlassCard style={styles.speechBubble} padding="medium">
                                <Typography variant="sass">"Honey, <Typography variant="body" style={styles.speechHighlight}>"you always"</Typography> is a brick wall. Try focusing on the specific event."</Typography>
                            </GlassCard>
                        </View>
                    </GlassCard>
                </View>

                <SquishyButton style={styles.ctaButton} size="large">
                    <Typography variant="button">CHECK FOR DEFENSIVENESS</Typography>
                </SquishyButton>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundSecondary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    scrollContainer: { 
        padding: SPACING.regular 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    headerSubtitle: { 
        marginTop: SPACING.small,
        opacity: 0.8
    },
    gameGrid: { 
        flexDirection: 'row', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xlarge 
    },
    glassPanel: { 
        flex: 1,
        backgroundColor: COLORS.backgroundCard,
        borderColor: COLORS.borderSubtle,
        borderWidth: 1,
    },
    panelTitle: { 
        color: COLORS.textPrimary,
        marginBottom: SPACING.regular 
    },
    textInput: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        fontSize: TYPOGRAPHY.fontSize.bodyLarge, 
        minHeight: 150 
    },
    analysisBox: { 
        backgroundColor: COLORS.backgroundPrimary, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        marginBottom: SPACING.regular 
    },
    highlightedText: { 
        color: COLORS.error, 
        fontWeight: 'bold', 
        textDecorationLine: 'underline' 
    },
    drMarcieContainer: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        gap: SPACING.regular 
    },
    drMarcieAvatar: { 
        width: SPACING.xxxlarge, 
        height: SPACING.xxxlarge, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.lavenderPurple
    },
    speechBubble: { 
        flex: 1,
        backgroundColor: COLORS.textPrimary,
    },
    speechHighlight: { 
        color: COLORS.vibrantPink, 
        fontWeight: 'bold' 
    },
    ctaButton: { 
        marginTop: SPACING.regular,
        ...SHADOWS.neon
    },
});

export default DefensivenessDetoxGameScreen;
