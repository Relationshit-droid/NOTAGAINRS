import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const CoupleDashboard = () => {
    return (
        <ScreenLayout showHeader={false}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Typography variant="h1" style={styles.headerTitle} center>
                        WELCOME, ALEX
                    </Typography>
                </View>
                
                <View style={styles.mainGrid}>
                    {/* Left Column */}
                    <View style={styles.column}>
                        <GlassCard style={styles.card}>
                            <Typography variant="label">TRUST THERMOMETER</Typography>
                            <Typography variant="h2" style={styles.trustValue}>78%</Typography>
                            <View style={styles.thermometer}>
                                <LinearGradient 
                                    colors={[COLORS.vibrantPink, COLORS.lavenderPurple]} 
                                    style={[styles.thermometerFill, {height: '78%'}]} 
                                />
                            </View>
                        </GlassCard>
                    </View>

                    {/* Center Column */}
                    <View style={[styles.column, {flex: 2}]}>
                        <GlassCard style={[styles.card, {backgroundColor: `${COLORS.vibrantPink}33`}]}>
                            <Typography variant="label">ACTIVE QUEST: DAILY DUEL</Typography>
                            <Typography variant="body" style={styles.questBody}>
                                "Describe your partner's best quality using only cosmic metaphors."
                            </Typography>
                            <SquishyButton onPress={() => {}}>
                                <Typography variant="button">START DUEL</Typography>
                            </SquishyButton>
                        </GlassCard>
                    </View>

                    {/* Right Column */}
                    <View style={styles.column}>
                         <GlassCard style={styles.card}>
                            <Typography variant="label">PARTNER: JAMIE</Typography>
                            <View style={styles.partnerStatus}>
                                <Typography variant="h1" style={styles.avatar}>😊</Typography>
                                <Typography variant="small" style={styles.partnerOnline}>ONLINE</Typography>
                            </View>
                        </GlassCard>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    scrollView: { 
        padding: SPACING.lg 
    },
    header: { 
        paddingBottom: SPACING.lg, 
        alignItems: 'center' 
    },
    headerTitle: {},
    mainGrid: { 
        flexDirection: 'row', 
        gap: SPACING.md 
    },
    column: { 
        flex: 1, 
        gap: SPACING.md 
    },
    card: { 
        minHeight: SPACING.xxxlarge * 3,
    },
    trustValue: { 
        color: COLORS.vibrantPink,
        textAlign: 'center',
        marginVertical: SPACING.sm,
    },
    thermometer: { 
        height: SPACING.xxlarge * 3, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.xlarge, 
        overflow: 'hidden', 
        justifyContent: 'flex-end' 
    },
    thermometerFill: { 
        width: '100%' 
    },
    questBody: { 
        flex: 1, 
        marginVertical: SPACING.lg,
    },
    partnerStatus: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        gap: SPACING.sm 
    },
    avatar: {},
    partnerOnline: { 
        color: COLORS.mintGreen,
        marginTop: SPACING.xs,
    },
});

export default CoupleDashboard;
