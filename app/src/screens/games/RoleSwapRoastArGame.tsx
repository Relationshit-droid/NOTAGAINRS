import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const RoleSwapRoastArGame = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return (
            <ScreenLayout showHeader={false} scrollable={false}>
                <View style={styles.permissionContainer}>
                    <Typography variant="body">Requesting camera permission...</Typography>
                </View>
            </ScreenLayout>
        );
    }
    if (hasPermission === false) {
        return (
            <ScreenLayout showHeader={false} scrollable={false}>
                <View style={styles.permissionContainer}>
                    <Typography variant="body">No access to camera</Typography>
                </View>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <View style={styles.container}>
                <Typography variant="h1" center style={styles.headerTitle}>Role-Swap Roast</Typography>

                <View style={styles.cameraContainer}>
                    <Camera style={styles.camera} type={Camera.Constants.Type.front}>
                        {/* AR Overlays */}
                        <View style={styles.arHudTop}>
                            <GlassCard style={styles.hudItem}>
                                <Typography variant="caption" style={styles.hudText}>🔴 LIVE FEEDBACK</Typography>
                            </GlassCard>
                        </View>
                        <View style={styles.marcieOverlay}>
                            <Typography variant="h2" style={styles.marcieScore}>88/100</Typography>
                            <Typography variant="caption" style={styles.marcieComment}>"Ooh, that was particularly petty!"</Typography>
                        </View>
                    </Camera>
                </View>

                <View style={styles.controlsContainer}>
                    <View style={styles.statsContainer}>
                        <Typography variant="caption" style={styles.streakLabel}>Current Pettiness Streak</Typography>
                        <Typography variant="h2" style={styles.streakValue}>x4.5</Typography>
                    </View>
                    <SquishyButton onPress={() => setIsRecording(!isRecording)} style={styles.recordButton}>
                        <MaterialIcons name={isRecording ? 'stop' : 'radio-button-checked'} size={40} color={COLORS.textPrimary} />
                    </SquishyButton>
                    <View style={styles.actionsContainer}>
                        <SquishyButton onPress={() => {}} style={styles.actionButton}>
                            <MaterialIcons name="face-retouching-natural" size={24} color={COLORS.textPrimary} />
                        </SquishyButton>
                        <SquishyButton onPress={() => {}} style={styles.actionButton}>
                            <MaterialIcons name="share" size={24} color={COLORS.textPrimary} />
                        </SquishyButton>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: SPACING.regular, 
        justifyContent: 'space-between' 
    },
    permissionContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    headerTitle: { 
        textTransform: 'uppercase' 
    },
    cameraContainer: { 
        aspectRatio: 16 / 9, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        overflow: 'hidden', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle 
    },
    camera: { 
        flex: 1, 
        justifyContent: 'space-between' 
    },
    arHudTop: { 
        position: 'absolute', 
        top: SPACING.regular, 
        left: SPACING.regular, 
        gap: SPACING.small 
    },
    hudItem: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small 
    },
    hudText: { 
        color: COLORS.textPrimary 
    },
    marcieOverlay: { 
        position: 'absolute', 
        bottom: SPACING.regular, 
        right: SPACING.regular, 
        backgroundColor: COLORS.backgroundCard, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    marcieScore: { 
        color: COLORS.warmOrange 
    },
    marcieComment: { 
        color: COLORS.textPrimary 
    },
    controlsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: SPACING.regular 
    },
    statsContainer: { 
        flex: 1 
    },
    streakLabel: { 
        color: COLORS.textSecondary 
    },
    streakValue: { 
        color: COLORS.warmOrange 
    },
    recordButton: { 
        width: 80, 
        height: 80, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.warmOrange, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: SPACING.none,
        minHeight: 80
    },
    actionsContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        gap: SPACING.regular 
    },
    actionButton: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: COLORS.backgroundInput, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
});

export default RoleSwapRoastArGame;
