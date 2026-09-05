import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function RansomNoteRomance({ navigation }: any) {
    useEffect(() => {
        speakMarcie("'OR I WILL REORGANIZE YOUR SOCK DRAWER BY MOOD'? Chef's kiss.");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn} variant="secondary" size="small">
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.title}>Ransom Note Romance</Typography>
                </View>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Type: Drag-and-drop cutout</Typography>
                    <Typography variant="body">Mechanics: Build threat: "GIVE ME… TACOS… OR… I… SERENADE YOU."</Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="h2" style={styles.cardTitle}>Scoring</Typography>
                    <Typography variant="body">
                        ✅ Absurdly sweet = +20 (Marcie judges){'\n'}
                        ✅ Partner laughs (self-reported ✅) = +10
                    </Typography>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Opening Cutouts...')} style={styles.playBtn}>
                        <Typography variant="h2" color={COLORS.textPrimary}>Create Note</Typography>
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
        padding: SPACING.screenPadding, 
        gap: SPACING.regular,
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.small, 
        marginTop: SPACING.regular,
    },
    backBtn: { 
        paddingHorizontal: SPACING.regular, 
        paddingVertical: SPACING.small, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large,
    },
    title: { 
        flex: 1,
    },
    card: { 
        padding: SPACING.cardPadding,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    cardTitle: {
        marginBottom: SPACING.small,
    },
    actionArea: { 
        marginTop: SPACING.xxlarge, 
        alignItems: 'center',
    },
    playBtn: { 
        width: '80%',
    },
});
