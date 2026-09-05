import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const ToolButton = ({ label, active }: { label: string, active?: boolean }) => (
    <SquishyButton style={[styles.toolButton, active && styles.activeTool]} variant={active ? 'primary' : 'ghost'} size="small">
        <Typography variant="caption" style={[styles.toolLabel, active && styles.activeToolLabel]}>{label}</Typography>
    </SquishyButton>
);

const GuessMessage = ({ user, message, highlight }: { user: string, message: string, highlight?: boolean }) => (
    <GlassCard style={[styles.messageBubble, highlight && styles.highlightBubble]} padding="small">
        <Typography variant="caption" style={styles.messageUser}>{user}</Typography>
        <Typography variant="body" style={styles.messageText}>{message}</Typography>
    </GlassCard>
);

const DrawYourFeelingsGameScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
            <View style={styles.mainLayout}>
                {/* Left Sidebar */}
                <GlassCard style={styles.sidebar} padding="medium">
                    <View style={styles.toolPanel}>
                        <Typography variant="h3" style={styles.panelTitle}>Art Tools</Typography>
                        <ToolButton label="Brush" active />
                        <ToolButton label="Eraser" />
                        <ToolButton label="Stroke Size" />
                        <ToolButton label="Turquoise Fixed" />
                    </View>
                    <GlassCard style={styles.drMarciePanel} padding="medium">
                        <Typography variant="sass">"Notice the jagged turquoise lines... Let that vulnerability flow."</Typography>
                    </GlassCard>
                </GlassCard>

                {/* Center Canvas */}
                <View style={styles.canvasContainer}>
                    <Typography variant="h2" center>Draw <Typography variant="h2" style={styles.italicHighlight}>"Vulnerability"</Typography></Typography>
                    <View style={styles.canvas}>
                        <Svg height="100%" width="100%" viewBox="0 0 800 600">
                            <Path d="M150 450 Q 250 150 400 300 T 650 100" fill="none" stroke="#40E0D0" strokeWidth="6" />
                            <Path d="M200 500 C 300 400, 350 550, 450 450" fill="none" stroke="#40E0D0" strokeWidth="4" strokeDasharray="8, 4" />
                        </Svg>
                    </View>
                    <SquishyButton style={styles.submitButton}>
                        <Typography variant="button">Submit Art</Typography>
                    </SquishyButton>
                </View>

                {/* Right Sidebar */}
                <GlassCard style={styles.sidebar} padding="medium">
                    <View style={styles.chatPanel}>
                        <Typography variant="h3" style={styles.panelTitle}>Partner's Guesses</Typography>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <GuessMessage user="Alex" message="Is it a broken heart? 💔" />
                            <GuessMessage user="Alex" message="Fragility? Like a glass box?" highlight />
                            <GuessMessage user="Alex" message="EXPOSURE? 👁️" />
                        </ScrollView>
                    </View>
                </GlassCard>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    mainLayout: { 
        flexDirection: 'row', 
        flex: 1, 
        padding: SPACING.regular 
    },
    sidebar: { 
        width: 250, 
        gap: SPACING.regular,
        ...SHADOWS.card
    },
    toolPanel: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        borderColor: COLORS.borderSubtle, 
        borderWidth: 1 
    },
    panelTitle: { 
        color: COLORS.textPrimary,
        marginBottom: SPACING.regular 
    },
    toolButton: { 
        padding: SPACING.small, 
        borderRadius: BORDER_RADIUS.medium, 
        marginBottom: SPACING.small,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    },
    activeTool: { 
        backgroundColor: COLORS.vibrantPink, 
        ...SHADOWS.neonSoft 
    },
    toolLabel: { 
        color: COLORS.textSecondary 
    },
    activeToolLabel: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold' 
    },
    drMarciePanel: { 
        marginTop: 'auto',
        backgroundColor: COLORS.backgroundCard,
        borderColor: 'rgba(253, 13, 133, 0.3)',
        borderWidth: 1
    },
    canvasContainer: { 
        flex: 1, 
        paddingHorizontal: SPACING.regular, 
        alignItems: 'center' 
    },
    italicHighlight: {
        fontStyle: 'italic',
        color: COLORS.vibrantPink,
    },
    canvas: { 
        width: '100%', 
        aspectRatio: 4 / 3, 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        borderRadius: BORDER_RADIUS.large, 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle, 
        borderStyle: 'dashed',
        marginTop: SPACING.regular
    },
    submitButton: { 
        marginTop: SPACING.xlarge,
        ...SHADOWS.buttonGlow
    },
    chatPanel: { 
        flex: 1, 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: BORDER_RADIUS.large, 
        borderColor: COLORS.borderSubtle, 
        borderWidth: 1, 
        overflow: 'hidden',
        padding: SPACING.small
    },
    messageBubble: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderTopLeftRadius: 0, 
        marginBottom: SPACING.small, 
        marginHorizontal: SPACING.tiny,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle
    },
    highlightBubble: { 
        backgroundColor: 'rgba(253, 13, 133, 0.2)', 
        borderColor: 'rgba(253, 13, 133, 0.3)' 
    },
    messageUser: { 
        color: COLORS.textHint, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.tiny 
    },
    messageText: { 
        color: COLORS.textSecondary 
    },
});

export default DrawYourFeelingsGameScreen;
