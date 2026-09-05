
import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const StatBar = ({ label, value, color, percentage }: { label: string; value: string; color: string; percentage: string }) => (
    <GlassCard style={styles.statBarContainer} variant="outlined">
        <View style={styles.statBarLabelContainer}>
            <Typography variant="caption" style={styles.statBarLabel}>{label}</Typography>
            <Typography variant="button" style={[styles.statBarValue, { color }]}>{value}</Typography>
        </View>
        <View style={styles.statBarBackground}>
            <LinearGradient colors={[color, `${color}80`]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.statBar, { width: percentage }]} />
        </View>
    </GlassCard>
);

const LoveMapGapQuest2Screen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <LinearGradient colors={[COLORS.deepCosmicPurple, COLORS.midPurple]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Typography variant="header" style={styles.title}>MAP QUEST: THE FUTURE AMBITIONS SECTOR</Typography>
                
                <View style={styles.mainContainer}>
                    <View style={styles.sidebar}>
                        <GlassCard style={styles.marcieCard} variant="outlined">
                            <Typography variant="label" style={styles.marcieTitle}>MARCIE THE CARTOGRAPHER</Typography>
                            <Typography variant="marcieDialogue" style={styles.marcieQuote}>"Commander, we've hit a 'Here Be Dragons' zone..."</Typography>
                        </GlassCard>
                        <GlassCard style={styles.inputCard} variant="default">
                            <TextInput 
                                style={styles.textInput} 
                                placeholder="CRAFT DISCOVERY QUESTION..."
                                placeholderTextColor={COLORS.textSecondary}
                                multiline
                            />
                            <SquishyButton variant="primary" size="medium" onPress={() => {}}>
                                <Typography variant="button" color={COLORS.textPrimary}>TRANSMIT TO PARTNER</Typography>
                            </SquishyButton>
                        </GlassCard>
                    </View>

                    <GlassCard style={styles.mapArea} variant="elevated">
                        <Typography variant="body" style={styles.mapPlaceholderText}>[INTERACTIVE MAP AREA]</Typography>
                        <View style={styles.dragonsZone}>
                            <Typography variant="label" style={styles.dragonsZoneText}>HERE BE DRAGONS</Typography>
                        </View>
                    </GlassCard>
                </View>

                <View style={styles.statsContainer}>
                    <StatBar label="SYNCHRONICITY" value="84%" color={COLORS.aquaTeal} percentage="84%" />
                    <StatBar label="VULNERABILITY" value="MEDIUM" color={COLORS.brightYellow} percentage="50%" />
                    <StatBar label="MAP INTEGRITY" value="NOMINAL" color={COLORS.vibrantPink} percentage="92%" />
                </View>

            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: { ...StyleSheet.absoluteFillObject },
    scrollContent: { padding: SPACING.regular },
    title: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    mainContainer: { flexDirection: 'row', gap: SPACING.regular },
    sidebar: { flex: 1, gap: SPACING.regular },
    marcieCard: { padding: SPACING.regular },
    marcieTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.small,
    },
    marcieQuote: { color: COLORS.textSecondary },
    inputCard: { padding: SPACING.regular },
    textInput: { 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.medium, 
        padding: SPACING.regular, 
        color: COLORS.textPrimary, 
        minHeight: 100, 
        marginBottom: SPACING.regular, 
        textAlignVertical: 'top', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    mapArea: { 
        flex: 2, 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: SPACING.regular,
    },
    mapPlaceholderText: { 
        color: COLORS.textSecondary, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    dragonsZone: { 
        position: 'absolute', 
        top: '35%', 
        right: '25%', 
        padding: SPACING.xlarge, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2, 
        borderColor: COLORS.vibrantPink, 
        alignItems: 'center' 
    },
    dragonsZoneText: { color: COLORS.vibrantPink },
    statsContainer: { flexDirection: 'row', gap: SPACING.small, marginTop: SPACING.regular },
    statBarContainer: { flex: 1, padding: SPACING.regular },
    statBarLabelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.tiny },
    statBarLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        fontWeight: 'bold' 
    },
    statBarValue: { fontWeight: 'bold' },
    statBarBackground: { 
        height: 4, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.small 
    },
    statBar: { height: '100%', borderRadius: BORDER_RADIUS.small },
});

export default LoveMapGapQuest2Screen;
