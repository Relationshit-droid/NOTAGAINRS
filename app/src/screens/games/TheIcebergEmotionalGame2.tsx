
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const TheIcebergEmotionalGame2 = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.deepCosmic]} style={styles.container}>
                <View style={styles.header}>
                    <Typography variant="h1" center>The Iceberg Excavation</Typography>
                </View>

                <View style={styles.icebergCanvas}>
                    {/* Placeholder for the iceberg visual */}
                    <View style={styles.icebergVisual} />

                    {/* Emotion Nodes */}
                    <GlassCard style={[styles.node, styles.surfaceNode]}>
                        <MaterialIcons name="priority-high" size={16} color={COLORS.textPrimary} />
                    </GlassCard>
                    <GlassCard style={[styles.node, styles.midNode]}>
                        <MaterialIcons name="water-drop" size={20} color={COLORS.textPrimary} />
                    </GlassCard>
                    <GlassCard style={[styles.node, styles.deepNode]}>
                        <MaterialIcons name="lock" size={24} color={COLORS.textPrimary} />
                    </GlassCard>
                </View>

                <GlassCard style={styles.insightCard} variant="outlined">
                    <Typography variant="h3">Insight Discovered</Typography>
                    <Typography variant="body" style={styles.insightText}>
                        "Anger is often a shield for sadness. Why is it safer to be angry?"
                    </Typography>
                    <SquishyButton onPress={() => {}} size="medium">
                        <Typography variant="button">Discuss Prompt</Typography>
                    </SquishyButton>
                </GlassCard>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    header: { 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    icebergCanvas: { 
        flex: 1, 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative' 
    },
    icebergVisual: {
        width: '80%',
        height: '60%',
        backgroundColor: COLORS.backgroundInput,
        transform: [{ rotate: '45deg' }],
        borderRadius: BORDER_RADIUS.xlarge,
    },
    node: {
        position: 'absolute',
        borderRadius: BORDER_RADIUS.large,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    surfaceNode: {
        top: '20%',
        left: '55%',
        width: 40,
        height: 40,
    },
    midNode: {
        top: '45%',
        left: '65%',
        width: 50,
        height: 50,
    },
    deepNode: {
        top: '75%',
        left: '40%',
        width: 60,
        height: 60,
    },
    insightCard: {
        position: 'absolute',
        bottom: SPACING.xlarge,
        right: SPACING.xlarge,
        width: '70%',
        padding: SPACING.regular,
        borderColor: COLORS.warmOrange,
    },
    insightText: { 
        color: COLORS.textSecondary, 
        marginVertical: SPACING.regular, 
        fontStyle: 'italic' 
    },
});

export default TheIcebergEmotionalGame2;
