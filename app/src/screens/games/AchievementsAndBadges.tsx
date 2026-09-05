import React from 'react';
import {
    View, StyleSheet, FlatList, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { ScreenLayout, Typography, GlassCard } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const achievements = [
    { id: '1', title: 'Communication King', desc: 'Unlock 10 deep conversations', unlocked: true, icon: 'forum', date: '2d ago' },
    { id: '2', title: 'Conflict Crusher', desc: 'Resolve a Tier 3 argument', unlocked: true, icon: 'shield', date: '1w ago' },
    { id: '3', title: 'First Date Redux', desc: 'Recreate your very first date', unlocked: false, icon: 'lock', progress: 40 },
    { id: '4', title: 'Golden Anniversary', desc: 'Maintain a 365-day streak', unlocked: false, icon: 'lock', progress: 12 },
    { id: '5', title: 'True Empath', desc: 'Identify 5 unstated emotions', unlocked: true, icon: 'volunteer-activism', date: 'Yesterday' },
    { id: '6', title: 'World Travelers', desc: 'Unlock 5 destination quests', unlocked: false, icon: 'lock', progress: 60 },
];

const AchievementCard = ({ item }: { item: typeof achievements[0] }) => {
    if (item.unlocked) {
        return (
            <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={[styles.card, styles.unlockedCard]}
            >
                <View style={styles.cardInner}>
                    <View style={styles.unlockedIconContainer}>
                        <MaterialIcons name={item.icon as any} size={32} color={COLORS.textPrimary} />
                    </View>
                    <Typography variant="h4" style={styles.cardTitle}>{item.title}</Typography>
                    <Typography variant="body" style={styles.cardDesc}>{item.desc}</Typography>
                    <Typography variant="caption" style={styles.cardDate}>{item.date}</Typography>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.lockedCard]}
        >
            <View style={styles.cardInner}>
                <View style={styles.lockedIconContainer}>
                    <MaterialIcons name="lock" size={32} color={COLORS.textSecondary} />
                </View>
                <Typography variant="h4" style={styles.cardTitle}>{item.title}</Typography>
                <Typography variant="body" style={styles.cardDesc}>{item.desc}</Typography>
                <View style={styles.progressBar}>
                    <LinearGradient
                        colors={[COLORS.warmOrange, COLORS.brightYellow]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.progressFill, { width: `${item.progress}%` }]}
                    />
                </View>
            </View>
        </LinearGradient>
    );
};

const AchievementsAndBadgesScreen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Achievements and badges celebrate your growth as a couple! Each milestone represents real progress in your relationship.">
            <View style={styles.content}>
                <Typography variant="h1" style={styles.title}>
                    The Love Arcade
                </Typography>
                <Typography variant="h2" style={styles.subtitle}>
                    +100 Games to Deepen Connection
                </Typography>

                <View style={styles.header}>
                    <Typography variant="h3">Achievements</Typography>
                    <Typography variant="caption" style={styles.headerSubtitle}>12 / 40 Collected</Typography>
                </View>

                <FlatList
                    data={achievements}
                    renderItem={({ item }) => <AchievementCard item={item} />}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    ListHeaderComponent={() => (
                         <View style={styles.statsContainer}>
                            <LinearGradient
                                colors={GRADIENTS.primary.colors}
                                start={GRADIENTS.primary.start}
                                end={GRADIENTS.primary.end}
                                style={styles.statBox}
                            >
                                <Typography variant="h3" style={styles.statValue}>2,450</Typography>
                                <Typography variant="caption" style={styles.statLabel}>XP</Typography>
                            </LinearGradient>
                            <LinearGradient
                                colors={[COLORS.mintGreen, COLORS.softViolet]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statBox}
                            >
                                <Typography variant="h3" style={styles.statValue}>Top 15%</Typography>
                                <Typography variant="caption" style={styles.statLabel}>Rank</Typography>
                            </LinearGradient>
                            <LinearGradient
                                colors={[COLORS.warmOrange, COLORS.brightYellow]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statBox}
                            >
                                <Typography variant="h3" style={styles.statValue}>14</Typography>
                                <Typography variant="caption" style={styles.statLabel}>Streak</Typography>
                            </LinearGradient>
                        </View>
                    )}
                />
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    content: { 
        flex: 1, 
        padding: SPACING.lg 
    },
    title: { 
        textAlign: 'center', 
        marginBottom: SPACING.sm 
    },
    subtitle: { 
        textAlign: 'center', 
        opacity: 0.7, 
        marginBottom: SPACING.lg 
    },
    header: { 
        padding: SPACING.lg, 
        alignItems: 'center' 
    },
    headerSubtitle: { 
        marginTop: SPACING.xs,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingHorizontal: SPACING.regular, 
        marginBottom: SPACING.lg 
    },
    statBox: { 
        alignItems: 'center', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large, 
        width: 100,
        ...SHADOWS.large,
    },
    statValue: { 
        color: COLORS.textPrimary,
    },
    statLabel: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.xs,
    },
    grid: { 
        paddingHorizontal: SPACING.small 
    },
    card: { 
        flex: 1, 
        margin: SPACING.small, 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.regular, 
        alignItems: 'center', 
        minHeight: 180,
        ...SHADOWS.large,
    },
    cardInner: {
        flex: 1,
        alignItems: 'center',
    },
    unlockedCard: { 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle,
    },
    lockedCard: { 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle,
    },
    unlockedIconContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
    },
    lockedIconContainer: { 
        width: 60, 
        height: 60, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.borderSubtle,
    },
    cardTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.xs,
    },
    cardDesc: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.small,
    },
    cardDate: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    progressBar: { 
        height: 8, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        width: '80%', 
        borderRadius: BORDER_RADIUS.small, 
        overflow: 'hidden', 
        marginTop: 'auto',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    progressFill: { 
        height: '100%', 
        borderRadius: BORDER_RADIUS.small,
    },
});

export default AchievementsAndBadgesScreen;
