import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const VideoPanel = () => (
    <View style={styles.videoPanel}>
        <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiN6Q4CManweyEOrh4Efqh_CmqAMTBWRxVdWm5H804g8IVZstS17iL9nOhbfo0gSVBLVtot5_ZjNalRBifWwSm-O9WJQuchs8wZvmzc_Kms-k27Giyu3OI_jSUSOp0nCMSSWVCL8VvJsF0k0Jp0OXGIEovJQYdSC0FvBELVpi2nrRAfbrKUQmcFCJ_dYSSjgnPvGuXp7CBoJZNufWxKT9Wq6B7aheKPEa4zKx2rht7RPRRgto4vZzfdY7Nb6HEbO5USIl1WKO7Mgrk' }}
            style={styles.videoBackground}
            imageStyle={{ borderRadius: BORDER_RADIUS.xlarge }}
        >
            <View style={styles.recBadge}>
                <View style={styles.recDot} />
                <Typography variant="label" style={styles.recText}>REC</Typography>
            </View>
        </ImageBackground>
    </View>
);

const WordChoice = ({ number, word, onClear }: { number: string, word?: string, onClear?: () => void }) => (
    <View style={styles.wordChoiceContainer}>
        <Typography variant="bodyMedium" style={styles.wordNumber}>{number}.</Typography>
        <Typography variant="bodyMedium" style={styles.wordText}>{word || '...'}</Typography>
        {word && <SquishyButton title="❌" onPress={onClear || (() => {})} size="small" />}
    </View>
);

const MirrorModeVideoGame = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="displaySmall" style={styles.headerTitle}>MIRROR MODE: DESCRIBE ME IN 3 WORDS</Typography>

            <View style={styles.mainContent}>
                <View style={styles.leftPanel}>
                    <VideoPanel />
                    <GlassCard style={styles.analysisContainer}>
                        <Typography variant="bodySmall" style={{textAlign: 'center', textTransform: 'uppercase'}}>VOCAL TONE & AUTHENTICITY GAUGES</Typography>
                    </GlassCard>
                </View>
                
                <View style={styles.rightPanel}>
                    <GlassCard style={styles.wordSelectionPanel}>
                        <Typography variant="headerSmall" style={styles.wordSelectionTitle}>YOUR WORD CHOICES</Typography>
                        <WordChoice number="01" word="RADIANT" onClear={() => {}} />
                        <WordChoice number="02" />
                        <WordChoice number="03" />
                        <SquishyButton title="SUBMIT SELECTION" onPress={() => {}} />
                    </GlassCard>
                    <GlassCard style={styles.critiquePanel}>
                        <Typography variant="label" style={styles.critiqueTitle}>THE STYLIST'S CRITIQUE</Typography>
                        <Typography variant="bodyMedium" style={styles.critiqueText}>"Ooh, the emotional alignment here is sparkling!"</Typography>
                    </GlassCard>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    headerTitle: { 
        textAlign: 'center', 
        marginBottom: SPACING.regular, 
        textTransform: 'uppercase' 
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    leftPanel: { 
        flex: 1.5, 
        gap: SPACING.regular 
    },
    rightPanel: { 
        flex: 1, 
        gap: SPACING.regular 
    },
    videoPanel: { 
        height: 250, 
        backgroundColor: COLORS.borderSubtle, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        borderWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    videoBackground: { 
        flex: 1, 
        padding: SPACING.regular 
    },
    recBadge: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.error, 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.medium, 
        alignItems: 'center', 
        alignSelf: 'flex-start' 
    },
    recDot: { 
        width: 8, 
        height: 8, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.textPrimary, 
        marginRight: SPACING.tiny 
    },
    recText: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase' 
    },
    analysisContainer: { 
        flex: 1, 
        justifyContent: 'center' 
    },
    wordSelectionPanel: { 
        gap: SPACING.small 
    },
    wordSelectionTitle: { 
        textAlign: 'center', 
        marginBottom: SPACING.small, 
        textTransform: 'uppercase' 
    },
    wordChoiceContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large 
    },
    wordNumber: { 
        color: COLORS.info, 
        fontWeight: 'bold', 
        marginRight: SPACING.small 
    },
    wordText: { 
        color: COLORS.textPrimary, 
        flex: 1, 
        textTransform: 'uppercase' 
    },
    critiquePanel: { 
        borderColor: COLORS.glowPink 
    },
    critiqueTitle: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase' 
    },
    critiqueText: { 
        color: COLORS.textPrimary, 
        fontStyle: 'italic', 
        marginTop: SPACING.small 
    },
});

export default MirrorModeVideoGame;
