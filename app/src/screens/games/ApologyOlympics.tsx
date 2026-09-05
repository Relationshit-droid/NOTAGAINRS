import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';
import { speakMarcie } from '../../lib/voice-engine';

export default function ApologyOlympics({ navigation }: any) {
    useEffect(() => {
        speakMarcie("'I shut down and it made you feel abandoned—I'll pause next time'? 35/35. Gold and my respect.");
    }, []);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.deepCosmic, COLORS.backgroundPrimary]} style={styles.background} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Typography variant="body">Back</Typography>
                    </SquishyButton>
                    <Typography variant="h1" style={styles.title}>The Apology Olympics</Typography>
                </View>

                {/* Dr. Marcie Section */}
                <View style={styles.drMarcieSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                    </View>
                    <View style={styles.quoteBox}>
                        <Typography variant="sass">Master the art of genuine apologies! Own your actions, acknowledge impact, and offer repair.</Typography>
                    </View>
                </View>

                <GlassCard style={styles.card}>
                    <Typography variant="instructions" style={styles.instructionsText}>Type: Speed rewrite + AI rubric</Typography>
                    <Typography variant="body">Mechanics: Rewrite "Sorry you felt that way" in {'<'}60s. Must avoid: but, if, you, however.</Typography>
                </GlassCard>

                <GlassCard style={styles.card}>
                    <Typography variant="instructions" style={styles.instructionsText}>Scoring (AI Rubric)</Typography>
                    <Typography variant="body">
                        Ownership ("I did X") = +10{'\n'}
                        Impact named ("…made you feel Y") = +10{'\n'}
                        Repair offered ("Next time, I'll Z") = +10{'\n'}
                        No blame-shifting = +5
                    </Typography>
                </GlassCard>

                <View style={styles.actionArea}>
                    <SquishyButton onPress={() => alert('Rubric loaded. Ready?')} style={styles.playBtn}>
                        <Typography variant="button" style={styles.buttonText}>Start Rewrite</Typography>
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
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    content: { 
        padding: SPACING.regular, 
        gap: SPACING.regular 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: SPACING.regular, 
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
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xlarge,
        padding: SPACING.regular,
        marginBottom: SPACING.regular
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    card: { 
        padding: SPACING.regular,
        backgroundColor: COLORS.backgroundCard,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    actionArea: { 
        marginTop: SPACING.xlarge, 
        alignItems: 'center' 
    },
    playBtn: { 
        width: '80%', 
    },
    instructionsText: {
        marginBottom: SPACING.regular,
    },
    buttonText: {
        color: COLORS.textPrimary,
    },
});
