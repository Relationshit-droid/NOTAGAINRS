import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const USER_COLOR = COLORS.info;
const PARTNER_COLOR = COLORS.brightYellow;

const ProfileStat = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.profileStatContainer}>
        <Typography variant="headerMedium" style={styles.profileStatValue}>{value}</Typography>
        <Typography variant="label" style={styles.profileStatLabel}>{label}</Typography>
    </View>
);

const ProgressBar = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <View style={{width: '100%'}}>
        <View style={styles.progressLabelContainer}>
            <Typography variant="label" style={styles.progressLabel}>{label}</Typography>
            <Typography variant="label" style={[styles.progressValue, { color }]}>{value}</Typography>
        </View>
        <View style={styles.progressTrack}>
            <LinearGradient colors={[color, `${color}80`]} start={{x:0, y:0}} end={{x:1, y:0}} style={[styles.progressFill, { width: value }]} />
        </View>
    </View>
);

const ProfileCard = ({ name, title, avatarUri, score, consistency, streak, loveLanguage, color }: { name: string, title: string, avatarUri: string, score: number, consistency: number, streak: number, loveLanguage: string, color: string }) => (
    <GlassCard style={[styles.profileCard, { borderLeftColor: color, borderRightColor: color }]}>
        <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: color }]} />
        <Typography variant="headerLarge" style={styles.profileName}>{name}</Typography>
        <Typography variant="label" style={[styles.profileTitle, { color, backgroundColor: `${color}20` }]}>{title}</Typography>
        <View style={styles.statsBlock}>
            <ProgressBar label="WEEKLY SCORE" value={`${score}%`} color={color} />
            <ProgressBar label="CONSISTENCY" value={`${consistency}%`} color={color} />
        </View>
        <View style={styles.statsRow}>
            <ProfileStat label="DAILY STREAK" value={streak.toString()} />
            <ProfileStat label="LOVE LANGUAGE" value={loveLanguage} />
        </View>
    </GlassCard>
);

const PartnerComparisonProfile = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="displayLarge" style={styles.headerTitle}>PARTNER COMPARISON</Typography>
            <Typography variant="bodyMedium" style={styles.headerSubtitle}>A cosmic look at your relationship alignment</Typography>

            <View style={styles.comparisonGrid}>
                <ProfileCard 
                    name="ALEX"
                    title="STAR VOYAGER"
                    avatarUri='https://lh3.googleusercontent.com/aida-public/AB6AXuAaEpXrVa6vTdya0fN1hBHpAklNewL62GPQQ0QAGTEAmJPEO8QfkxkQU18_mAnX877vo_mG6ZIx0QT_Y-k7BVA_qUHBns-7cL4jNwx0NwA13J0mU0PDhZSchY1AEI9-Ki5XQSU4eb64O0YOq7PphD5-AOf9W9CI1g7Pm_gmJ2mJVaxU-AJqeH3kDTJXZ4t3SM7NSriVUKC4E3zmT2-YHwWWNDFH6VeYKzAtgCz75Scnj_zL9Y5hE5Dwg0Aw7rRhaUOL1LmwtIZd20gQ'
                    score={84}
                    consistency={92}
                    streak={12}
                    loveLanguage="Words"
                    color={USER_COLOR}
                />
                <View style={styles.matchContainer}>
                    <View style={styles.matchRing}>
                        <Typography variant="displayLarge" style={styles.matchPercentage}>88%</Typography>
                        <Typography variant="label" style={styles.matchLabel}>ALIGNMENT</Typography>
                    </View>
                </View>
                <ProfileCard 
                    name="JORDAN"
                    title="GALAXY GUARDIAN"
                    avatarUri='https://lh3.googleusercontent.com/aida-public/AB6AXuC2Gi4fonAjY3RRaACqv-ikoUhyv2dt4ZLYbpDRjWHZ9SdguUT_JtC0xWxixVnY7GFrs53GXEu1EAvDxHgqbwmezeFHgZqsFuOVCJIf7eAnWoBypNtoFaCLkqSTFJO0zMUwQNa7jdLno6hZ6KjsfdepIRcnbfgCbQIwx7jdekhCWs630X1AmRK-zebX_A72hVigUD_KlnAl8d2fIg42jIH0nRXZ9-krJWZzvGaGsyMHsCa3Ynx85yE3qwebhhYA9NG2R8NrUsJ1lWSm'
                    score={79}
                    consistency={88}
                    streak={8}
                    loveLanguage="Quality"
                    color={PARTNER_COLOR}
                />
            </View>
            <SquishyButton 
                title="🔄 RECALCULATE SYNC" 
                onPress={() => {}} 
                variant="secondary"
                style={styles.recalculateButton}
            />
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    headerTitle: { 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.xlarge, 
        textTransform: 'uppercase' 
    },
    comparisonGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: SPACING.small 
    },
    profileCard: { 
        flex: 1, 
        alignItems: 'center', 
        borderLeftWidth: 2, 
        borderRightWidth: 2 
    },
    avatar: { 
        width: 90, 
        height: 90, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 3, 
        marginBottom: SPACING.regular 
    },
    profileName: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase' 
    },
    profileTitle: { 
        textTransform: 'uppercase', 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.medium, 
        marginTop: SPACING.tiny, 
        letterSpacing: 1 
    },
    statsBlock: { 
        marginVertical: SPACING.regular, 
        width: '100%', 
        gap: SPACING.regular 
    },
    progressLabelContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: SPACING.tiny 
    },
    progressLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase' 
    },
    progressValue: { 
        fontWeight: 'bold' 
    },
    progressTrack: { 
        height: 10, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.small 
    },
    progressFill: { 
        height: '100%', 
        borderRadius: BORDER_RADIUS.small, 
        ...SHADOWS.neon 
    },
    statsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        width: '100%', 
        gap: SPACING.small 
    },
    profileStatContainer: { 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.medium, 
        padding: SPACING.small, 
        flex: 1 
    },
    profileStatValue: { 
        color: COLORS.textPrimary 
    },
    profileStatLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        marginTop: SPACING.micro 
    },
    matchContainer: { 
        paddingHorizontal: SPACING.small, 
        alignItems: 'center' 
    },
    matchRing: { 
        width: 150, 
        height: 150, 
        borderRadius: BORDER_RADIUS.round, 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    matchPercentage: { 
        color: COLORS.textPrimary 
    },
    matchLabel: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase', 
        letterSpacing: 2 
    },
    recalculateButton: { 
        alignSelf: 'center', 
        marginTop: SPACING.xlarge 
    },
});

export default PartnerComparisonProfile;
