import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const MemoryLaneMapGame = () => {
    return (
        <ScreenLayout scrollable={true}>
            <View style={styles.header}>
                <Typography variant="bodySmall" style={styles.headerText}>THE MEMORY PROMPT</Typography>
                <Typography variant="headerLarge" style={styles.promptText}>WHERE WAS YOUR FIRST KISS?</Typography>
            </View>

            <View style={styles.mapContainer}>
                <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTUfesGcj6qwvejrCzaByvrDgq98cS2zEIqq8xv5mlO3VxJ0yRDQ8X_SnK0ebV45nUCHkGu4bKrBPmQCa8A2CTWkbHfx16xMgjfW_FXpZR5RTY08H-d3rgRi8lrJTZD690QKMWHfSnXDJYEqSwOwZAPx2LiBBYUprHgY_BvbsktISiCffV2XHagkTIa61eallZYiAj829s8m2xibKQUVPMxe5kctQcONo667ceVnj849U662UH-Y3bLHU6q2YkegYz0SUMQC85LPrg' }}
                    style={styles.mapBackground}
                    imageStyle={{ opacity: 0.6 }}
                >
                    <View style={styles.marker1}>
                        <Typography>❤️</Typography>
                    </View>
                    <View style={styles.marker2}>
                        <Typography>❤️</Typography>
                    </View>
                    <View style={styles.proximityLine} />
                    <Typography variant="label" style={styles.distanceText}>0.5 MILES</Typography>
                </ImageBackground>
            </View>

            <GlassCard style={styles.resultCard}>
                <View>
                    <Typography variant="headerLarge" style={styles.resultTitle}>98% MATCH</Typography>
                    <Typography variant="bodyMedium" style={styles.resultSubtitle}>You were only 0.5 miles apart!</Typography>
                </View>
                <SquishyButton title="NEXT MEMORY" onPress={() => {}} size="small" />
            </GlassCard>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        alignItems: 'center', 
        backgroundColor: COLORS.borderSubtle, 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        marginBottom: SPACING.regular, 
        borderWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    headerText: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase', 
        fontWeight: 'bold' 
    },
    promptText: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginTop: SPACING.small, 
        textTransform: 'uppercase' 
    },
    mapContainer: { 
        height: 300, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        overflow: 'hidden', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    mapBackground: { 
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    marker1: { 
        position: 'absolute', 
        left: '35%', 
        top: '55%', 
        backgroundColor: COLORS.vibrantPink, 
        padding: SPACING.small, 
        borderRadius: BORDER_RADIUS.round, 
        ...SHADOWS.neon 
    },
    marker2: { 
        position: 'absolute', 
        left: '60%', 
        top: '45%', 
        backgroundColor: COLORS.lavenderPurple, 
        padding: SPACING.small, 
        borderRadius: BORDER_RADIUS.round, 
        ...SHADOWS.neon 
    },
    proximityLine: { 
        position: 'absolute', 
        width: '30%', 
        height: 4, 
        backgroundColor: COLORS.info, 
        transform: [{ rotate: '-15deg' }] 
    },
    distanceText: { 
        position: 'absolute', 
        top: '40%', 
        backgroundColor: COLORS.textPrimary, 
        color: COLORS.backgroundPrimary, 
        padding: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.small, 
        textTransform: 'uppercase' 
    },
    resultCard: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: SPACING.regular 
    },
    resultTitle: { 
        color: COLORS.vibrantPink, 
        textTransform: 'uppercase' 
    },
    resultSubtitle: { 
        color: COLORS.textSecondary, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
});

export default MemoryLaneMapGame;
