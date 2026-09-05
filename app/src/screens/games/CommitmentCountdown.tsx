import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';

import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function CommitmentCountdown({ navigation }: any) {
    useEffect(() => {
        speakMarcie("Day 12: You both said 'thank you' unprompted? Alert the New York Times.");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Typography variant="body">Back</Typography>
                        </SquishyButton>
                        <Typography variant="h1" center style={styles.title}>The Love Arcade</Typography>
                    </View>
                    
                    <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

                    {/* Dr. Marcie Section */}
                    <GlassCard style={styles.drMarcieSection} variant="outlined">
                        <View style={styles.avatarContainer}>
                            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                        </View>
                        <View style={styles.quoteBox}>
                            <Typography variant="body">Build lasting commitment through daily micro-actions! Consistency creates trust.</Typography>
                        </View>
                    </GlassCard>

                    <GlassCard style={styles.card}>
                        <Typography variant="instructions" style={styles.instructionText}>Type: Shared 30-day streak</Typography>
                        <Typography variant="body">Mechanics: Daily micro-action ("Text one appreciation").</Typography>
                    </GlassCard>

                    <GlassCard style={styles.card}>
                        <Typography variant="instructions" style={styles.instructionText}>Scoring</Typography>
                        <Typography variant="body">
                            ✅ Daily = +5{'\n'}
                            ✅ 7-day streak = +20{'\n'}
                            ✅ 30-day = +200 + "Marcie tells a terrible pun"
                        </Typography>
                    </GlassCard>

                    <View style={styles.actionArea}>
                        <SquishyButton onPress={() => alert('Checking Streak...')} style={styles.playBtn}>
                            <Typography variant="button" style={styles.buttonText}>Check In</Typography>
                        </SquishyButton>
                    </View>
                </ScrollView>

        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    content: { 
        padding: SPACING.regular, 
        gap: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.xlarge 
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large 
    },
    title: { 
        flex: 1,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.small,
    },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.regular,
        padding: SPACING.regular,
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.medium,
        height: SPACING.xxlarge + SPACING.medium,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: SPACING.xxlarge,
        height: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
    card: { 
        padding: SPACING.regular,
    },
    instructionText: {
        marginBottom: SPACING.small,
    },
    buttonText: {
        color: COLORS.textPrimary,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center' 
    },
    playBtn: { 
        width: '80%', 
    },
});
