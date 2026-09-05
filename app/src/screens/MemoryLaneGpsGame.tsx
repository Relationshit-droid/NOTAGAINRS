
import React from 'react';
import { View, StyleSheet, ImageBackground, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const MemoryLaneGpsGame = () => {

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <GlassCard style={styles.header} variant="outlined">
                    <Typography variant="h3" style={styles.headerTitle}>CURRENT MISSION: BEST FIGHT-TURNED-HUG</Typography>
                </GlassCard>

                <View style={styles.mapContainer}>
                    <ImageBackground 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR1b8e3OCD6y_5rX2wJgLSWQep4pLH7MsydNBV1BqByA2m4OhiBTBt4x4mdb5fSK0Q0gVAF5t2KD8LYQUkt3MyvmIhMUAZSHf_9ZqVctTgTiyTdO_i_TagscVjCWa2bQ7jqgeoGpGxZhhMoeOUN37yIBku6Pg51bxk156JWrMGigLV4FAT7lAwSTsobyX-MycnvomlENz6W2lpIH5vxd_r-6bjF-P8a_tgnSKsRFDuroE7gUkt04iAtRwv-0FFGGtpxbjpN1Oic0CS' }}
                        style={styles.mapBackground}
                        imageStyle={{ opacity: 0.6 }}
                    >
                         <View style={styles.mapOverlay} />
                         <View style={styles.heartPinContainer}>
                            <View style={styles.heartPulse}>
                                <Typography variant="body">❤️</Typography>
                            </View>
                            <Typography variant="caption" style={styles.pinLabel}>THE SPOT</Typography>
                        </View>

                         <View style={styles.mapSearchContainer}>
                            <Typography variant="body">🔍</Typography>
                            <TextInput placeholder="SEARCH THE LOCATION..." placeholderTextColor={COLORS.textSecondary} style={styles.mapSearchInput} />
                        </View>

                    </ImageBackground>
                </View>

                <View style={styles.sidebar}>
                    <GlassCard style={styles.narratorContainer} variant="outlined">
                        <Typography variant="label" style={styles.narratorTitle}>GPS NARRATOR</Typography>
                        <Typography variant="marcieDialogue" style={styles.narratorText}>"Drop your heart pin exactly where the sparks flew after the storm."</Typography>
                    </GlassCard>

                    <Typography variant="h3" style={styles.previewTitle}>MEMORY PREVIEW</Typography>
                    <ImageBackground 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxsKxglf4x4FqmlvGhYP4OdFnNGT-VdE5tuXbpOScrzQ6zoitzu1rXz1x5mjdfmukqCGzzsNZ6oPjfPqpErXykbv8axx0ttar9ubV31B1-HjOVmI-1Qg_YJNhWNCzM0FFnrBhS4tJy4GNZ2bhchfZ1q18cPpCRTNWAwTksFDJPnFxz9L1wW3hSTBtWajUlk8c-b-mpuCgaP3RHyYMrgOebekTIj5caSXl5vW_3RER8t7ckp56PbrrMeFay9LELAIxfgpSS0zeO0NpV'}}
                        style={styles.previewImage}
                        imageStyle={{ borderRadius: BORDER_RADIUS.xxlarge }}
                    >
                        <SquishyButton variant="secondary" size="medium" onPress={() => {}} style={styles.uploadButton}>
                            <Typography variant="h2">☁️</Typography>
                            <Typography variant="label" style={styles.uploadText}>REPLACE PHOTO</Typography>
                        </SquishyButton>
                    </ImageBackground>

                    <SquishyButton variant="primary" size="large" onPress={() => {}} style={styles.confirmButton}>
                        <Typography variant="button" color={COLORS.textPrimary}>CONFIRM LOCATION</Typography>
                    </SquishyButton>
                    <SquishyButton variant="ghost" size="large" onPress={() => {}} style={styles.skipButton}>
                        <Typography variant="button">SKIP LANDMARK</Typography>
                    </SquishyButton>
                </View>

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { paddingBottom: SPACING.xlarge },
    header: { 
        padding: SPACING.regular, 
        alignItems: 'center', 
        backgroundColor: 'rgba(252, 12, 132, 0.2)', 
        borderRadius: BORDER_RADIUS.xlarge, 
        margin: SPACING.regular 
    },
    headerTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase' 
    },
    mapContainer: { 
        height: 400, 
        marginHorizontal: SPACING.regular, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle 
    },
    mapBackground: { flex: 1 },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    heartPinContainer: { position: 'absolute', top: '50%', left: '33%', alignItems: 'center' },
    heartPulse: { 
        backgroundColor: COLORS.vibrantPink, 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.round, 
        ...SHADOWS.neon
    },
    pinLabel: { 
        marginTop: SPACING.small, 
        backgroundColor: COLORS.vibrantPink, 
        color: COLORS.textPrimary, 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.medium,
    },
    mapSearchContainer: { 
        position: 'absolute', 
        bottom: SPACING.regular, 
        left: SPACING.regular, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        paddingHorizontal: SPACING.regular, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle 
    },
    mapSearchInput: { 
        flex: 1, 
        color: COLORS.textPrimary, 
        marginLeft: SPACING.small, 
        paddingVertical: SPACING.regular, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    sidebar: { 
        padding: SPACING.regular, 
        borderTopWidth: 1, 
        borderColor: COLORS.borderSubtle, 
        marginTop: SPACING.regular 
    },
    narratorContainer: { 
        padding: SPACING.regular, 
        marginBottom: SPACING.regular,
    },
    narratorTitle: { 
        color: COLORS.vibrantPink, 
        marginBottom: SPACING.tiny,
    },
    narratorText: { color: COLORS.textSecondary },
    previewTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small, 
        textTransform: 'uppercase' 
    },
    previewImage: { 
        height: 200, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle, 
        borderStyle: 'dashed', 
        borderRadius: BORDER_RADIUS.xxlarge 
    },
    uploadButton: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.xlarge, 
        alignItems: 'center' 
    },
    uploadText: { 
        color: COLORS.vibrantPink, 
        marginTop: SPACING.small,
    },
    confirmButton: { 
        marginTop: SPACING.xlarge,
    },
    skipButton: { 
        marginTop: SPACING.small,
    },
});

export default MemoryLaneGpsGame;
