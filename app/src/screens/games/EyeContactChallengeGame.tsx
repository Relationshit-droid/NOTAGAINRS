import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, GlassCard, Typography } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

const StatDisplay = ({ label, value, color }: { label: string, value: string, color?: string }) => (
    <View>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="h3" style={color ? { color } : {}}>{value}</Typography>
    </View>
);

const EyeContactChallengeGameScreen = () => {
    const player1Img = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw6jQN4G3_ozOpHskHdgCEZtIVE3rvW6dvr0CMLJA2dnDVViNjOuxGfZp2ok-GfZ16kHawoc5cBTOpg50Eub-9ZbOYvl7rDEF6vI_kKwz9SVwMMthh8fYMm_fsmQWT6Y2erghqbrxQ1Nm5aXjxeyodkzt7waYWtmb47BcEFAqO7M4wvoVh9fYp3X0mgG5ZvJWlU5q6Kx4X9PSHGds-UJBDjig7rIAGbN-NP1-CeQVaeliRg-TKyQVzsaCMSqJ__qqBE02fQ2Ewz2ib' };
    const player2Img = { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlObUMoIqneOJIiB970-VU-F71iwgSMBoDrsH2duaW04-tBgqYvjaLGwa2SIqyjMgFImBchzdQSzIg1Noho8h8nJHrGe0s3bF0ei5pqk0SM4Ugko564K04vG0bis_Uav6wpGo7WYVtwBD6PfqH5seILc48ZcKWOlusDGG9ABC8pBMRkqz_ID4tQZCXAqlB17rpYEAOKNYj1tHRKZYJ2B5rQmjXujqztM-8_WieCOE_oizSytoCZoJV4xpxFUuTn380EL8JQh1yS8ya' };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />

            <View style={styles.header}>
                <Typography variant="h1" center>The Love Arcade</Typography>
                <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>
            </View>

            <View style={styles.videoFeedsContainer}>
                <ImageBackground source={player1Img} style={styles.videoFeed} imageStyle={styles.videoImage}>
                    <GlassCard style={styles.playerNameCard}>
                        <Typography variant="caption">PLAYER 1: ALEX</Typography>
                    </GlassCard>
                </ImageBackground>

                <GlassCard style={styles.timerContainer}>
                    <Typography variant="h1" style={styles.timerText}>00:48</Typography>
                    <Typography variant="caption" style={styles.timerLabel}>Don't Look Away</Typography>
                </GlassCard>

                <ImageBackground source={player2Img} style={styles.videoFeed} imageStyle={styles.videoImage}>
                    <GlassCard style={styles.playerNameCard}>
                        <Typography variant="caption">PLAYER 2: SAM</Typography>
                    </GlassCard>
                </ImageBackground>
            </View>

            <GlassCard style={styles.footer}>
                <StatDisplay label="Time Locked" value="00:12:45" />
                <StatDisplay label="Pupil Dilat." value="NORMAL" color={COLORS.error} />
                <StatDisplay label="Heart Sync" value="88 BPM" color={COLORS.vibrantPink} />
            </GlassCard>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    header: { 
        padding: SPACING.regular, 
        alignItems: 'center' 
    },
    videoFeedsContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: SPACING.regular, 
        gap: SPACING.regular 
    },
    videoFeed: { 
        flex: 1, 
        aspectRatio: 16 / 9, 
        backgroundColor: COLORS.backgroundPrimary, 
        borderRadius: BORDER_RADIUS.xlarge, 
        justifyContent: 'flex-end' 
    },
    videoImage: { 
        borderRadius: BORDER_RADIUS.xlarge, 
        opacity: 0.8 
    },
    playerNameCard: { 
        padding: SPACING.small,
        margin: SPACING.small,
        alignSelf: 'flex-start'
    },
    timerContainer: { 
        padding: SPACING.xlarge, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle
    },
    timerText: {
        color: COLORS.error
    },
    timerLabel: { 
        marginTop: SPACING.small, 
        backgroundColor: COLORS.vibrantPink, 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.round 
    },
    footer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: SPACING.regular, 
        margin: SPACING.regular
    },
});

export default EyeContactChallengeGameScreen;
