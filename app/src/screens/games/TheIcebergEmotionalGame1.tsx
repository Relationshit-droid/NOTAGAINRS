
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const TheIcebergEmotionalGame1 = () => {
    const [revealed, setRevealed] = useState(false);

    const revealEmotion = () => {
        setRevealed(true);
        // In a real app, you would save this to Firestore here.
        console.log('Emotion revealed and saved to Firestore (simulated)');
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundPrimary]} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Typography variant="h1" center>THE ICEBERG</Typography>
                    <Typography variant="body" center style={styles.headerSubtitle}>
                        From surface reactions to hidden core needs.
                    </Typography>
                </View>

                <View style={styles.icebergContainer}>
                    {/* Surface Emotion */}
                    <View style={styles.surfaceContainer}>
                        <GlassCard style={styles.emotionNode}>
                            <Typography variant="h2">ANGER</Typography>
                        </GlassCard>
                    </View>

                    <View style={styles.waterline} />

                    {/* Deep Emotion */}
                    <View style={styles.deepContainer}>
                        {!revealed ? (
                            <SquishyButton onPress={revealEmotion} size="large">
                                <Typography variant="button">REVEAL CORE NEED</Typography>
                            </SquishyButton>
                        ) : (
                            <GlassCard style={styles.emotionNode}>
                                <Typography variant="h2">FEAR</Typography>
                            </GlassCard>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: SPACING.screenPadding 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    headerContainer: { 
        alignItems: 'center', 
        marginBottom: SPACING.xxlarge 
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.small 
    },
    icebergContainer: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    surfaceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deepContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waterline: { 
        height: 2, 
        width: '100%', 
        backgroundColor: COLORS.vibrantPink, 
        marginVertical: SPACING.large 
    },
    emotionNode: {
        paddingHorizontal: SPACING.xlarge,
        paddingVertical: SPACING.regular,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TheIcebergEmotionalGame1;
