
import React from 'react';
import { 
    View, StyleSheet, SafeAreaView, ScrollView, FlatList, TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const users = [
    { id: '#LA-9821-XP', username: '@stardust_lover', status: 'Active Now', tier: 'ETERNAL COSMOS', sos: '2h ago', progress: 0.75 },
    { id: '#LA-4412-ZY', username: '@nebula_jumper', status: 'Idle', tier: 'STAR-CROSSED', sos: '14m ago (URGENT)', progress: 0.25 },
    { id: '#LA-1029-QM', username: '@cosmic_queen', status: 'Active Now', tier: 'TRIAL PATHWAY', sos: 'Never', progress: 0.5 },
    { id: '#LA-2256-PV', username: '@solar_luna', status: 'Active Now', tier: 'ETERNAL COSMOS', sos: '5d ago', progress: 0.9 },
    { id: '#LA-0043-KX', username: '@void_zen', status: 'Offline', tier: 'STAR-CROSSED', sos: '1h ago', progress: 0.66 },
];

const StatCard = ({ title, value, change, color }: { title: string, value: string, change?: string, color: string }) => (
    <GlassCard style={[styles.statCard, { borderLeftColor: color }]}>
        <Typography variant="caption" style={styles.statTitle}>{title}</Typography>
        <Typography variant="header" style={styles.statValue}>{value}</Typography>
        {change && <Typography variant="caption" style={[styles.statChange, {color}]}>{change}</Typography>}
    </GlassCard>
);

const UserRow = ({ item }: { item: typeof users[0] }) => (
    <View style={styles.userRow}>
        <View style={styles.userInfo}>
            <View style={[styles.avatar, {backgroundColor: COLORS.richPlum}]}>
                <Typography variant="caption" style={{color: COLORS.vibrantPink}}>
                    {item.username.substring(1,3).toUpperCase()}
                </Typography>
            </View>
            <View>
                <Typography variant="body" style={styles.userId}>{item.id}</Typography>
                <Typography variant="caption" style={styles.username}>{item.username}</Typography>
            </View>
        </View>
        <View style={{flex: 1}}>
            <Typography variant="body" style={styles.statusText}>{item.status}</Typography>
        </View>
        <View style={{flex: 1}}>
            <Typography variant="caption" style={styles.tierText}>{item.tier}</Typography>
        </View>
        <SquishyButton size="small" onPress={() => {}}>
            <Typography variant="button" style={{ fontSize: TYPOGRAPHY.fontSize.bodySmall }}>VIEW</Typography>
        </SquishyButton>
    </View>
);

const AdminUserManagementList = () => {
    return (
        <ScreenLayout scrollable={false} showHeader={false}>
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.container}>
                    <View style={styles.header}>
                        <TextInput 
                            style={styles.searchInput} 
                            placeholder="Search User ID, Username..." 
                            placeholderTextColor={COLORS.textHint}
                        />
                    </View>
                    
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.statsGrid}>
                            <StatCard title="Total Users" value="24,592" change="+4.2%" color={COLORS.vibrantPink} />
                            <StatCard title="Active Now" value="1,842" change="Live" color={COLORS.info} />
                            <StatCard title="Premium Tier" value="8,210" change="33%" color={COLORS.lavenderPurple} />
                            <StatCard title="Pending SOS" value="12" change="Urgent" color={COLORS.error} />
                        </View>

                        <GlassCard style={styles.tableContainer}>
                            <FlatList
                                data={users}
                                renderItem={({item}) => <UserRow item={item} />}
                                keyExtractor={item => item.id}
                            />
                        </GlassCard>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundSecondary 
    },
    container: { 
        flex: 1 
    },
    header: { 
        padding: SPACING.regular, 
        backgroundColor: COLORS.backgroundInput, 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.divider 
    },
    searchInput: { 
        backgroundColor: COLORS.backgroundCard, 
        color: COLORS.textPrimary, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        paddingLeft: SPACING.xxlarge 
    },
    scrollView: { 
        padding: SPACING.regular 
    },
    statsGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: SPACING.regular, 
        gap: SPACING.small 
    },
    statCard: { 
        flex: 1, 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large, 
        borderLeftWidth: 4 
    },
    statTitle: { 
        color: COLORS.textHint, 
        fontSize: TYPOGRAPHY.fontSize.bodySmall, 
        textTransform: 'uppercase' 
    },
    statValue: { 
        color: COLORS.textPrimary, 
        fontSize: TYPOGRAPHY.fontSize.headerMedium, 
        fontWeight: TYPOGRAPHY.fontWeight.bold as any,
        marginVertical: SPACING.tiny 
    },
    statChange: { 
        fontSize: TYPOGRAPHY.fontSize.bodySmall, 
        fontWeight: TYPOGRAPHY.fontWeight.bold as any
    },
    tableContainer: { 
        borderRadius: BORDER_RADIUS.large 
    },
    userRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: SPACING.regular, 
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.divider 
    },
    userInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.regular, 
        flex: 2 
    },
    avatar: { 
        width: 32, 
        height: 32, 
        borderRadius: BORDER_RADIUS.small, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    userId: { 
        color: COLORS.textPrimary, 
        fontWeight: TYPOGRAPHY.fontWeight.bold as any,
        fontSize: TYPOGRAPHY.fontSize.bodySmall 
    },
    username: { 
        color: COLORS.textHint, 
        fontSize: TYPOGRAPHY.fontSize.bodySmall 
    },
    statusText: { 
        color: COLORS.textPrimary, 
        fontSize: TYPOGRAPHY.fontSize.bodySmall 
    },
    tierText: { 
        color: COLORS.lavenderPurple, 
        fontSize: TYPOGRAPHY.fontSize.bodySmall,
        flexShrink: 1, 
        backgroundColor: 'rgba(168, 85, 247, 0.2)', 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.round, 
        overflow: 'hidden', 
        textAlign: 'center' 
    },
});

export default AdminUserManagementList;
