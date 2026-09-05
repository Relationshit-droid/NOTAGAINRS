
import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const WelcomeAndDisclaimer = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <ScreenLayout scrollable={true} showHeader={false} contentStyle={styles.contentContainer}>
            <GlassCard style={styles.card}>
                <ImageBackground 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcGP9hICew7NeEpanWX2Xk6Ne7MpOihuxXhlKCUck_vFi1-28g3qeRTJtvtXU660CUS_7DESrTEMFub5_JK_NQXSUB4s7XTKHHjkOs-Vil1nG99pGS1ghbHhZqSOzEwHsSR9fCRUaaN9xDrVoKdYn40cpGis1rbi2HPL_V2TURnmGCtSwXuNH6yt6ulVbQS4N7Pb_JVo-jTSOgGk5-yRiP9VfwJjJ6BvvL3EBZ-VcmVVXnD98VLGBZfwrDHpc7ZG5kJRpEw7MHtpfs' }} 
                    style={styles.heroImage}
                >
                   <View style={styles.heroOverlay} />
                   <Typography variant="h1" style={styles.heroTitle}>WELCOME, SEEKERS</Typography>
                </ImageBackground>

                <View style={styles.disclaimerContent}>
                    <Typography variant="label" color={COLORS.vibrantPink} style={styles.disclaimerHeader}>LEGAL DISCLAIMER</Typography>
                    <Typography variant="body" color={COLORS.textSecondary} style={styles.disclaimerText}>
                        This game, <Typography variant="body" style={{fontWeight: 'bold'}}>Love Actually... The Game</Typography>, is designed for entertainment and connection.
                        It is NOT a replacement for professional therapy or medical advice.
                        By proceeding, you acknowledge that you are participating voluntarily.
                    </Typography>

                    <BouncyCheckbox
                        size={25}
                        fillColor={COLORS.vibrantPink}
                        unfillColor={COLORS.textPrimary}
                        text="I UNDERSTAND AND AGREE TO THE TERMS"
                        iconStyle={{ borderColor: COLORS.vibrantPink }}
                        innerIconStyle={{ borderWidth: 2 }}
                        textStyle={{ fontFamily: "JosefinSans-Regular", textDecorationLine: 'none', color: COLORS.textPrimary, fontWeight: 'bold'}}
                        onPress={(isChecked: boolean) => {setIsChecked(isChecked)}}
                        style={styles.checkboxContainer}
                    />

                    <SquishyButton 
                        onPress={() => {}}
                        disabled={!isChecked}
                        style={[styles.continueButton, !isChecked && styles.disabledButton]}
                    >
                        <Typography variant="button">CONTINUE JOURNEY</Typography>
                        <Typography style={{fontSize: TYPOGRAPHY.fontSize.headerLarge}}>🚀</Typography>
                    </SquishyButton>
                </View>
            </GlassCard>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    contentContainer: { 
        flexGrow: 1, 
        justifyContent: 'center' 
    },
    card: { 
        overflow: 'hidden',
    },
    heroImage: { 
        height: 180, 
        justifyContent: 'flex-end', 
        padding: SPACING.xlarge 
    },
    heroOverlay: { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: `${COLORS.backgroundPrimary}80`,
    },
    heroTitle: { 
        textTransform: 'uppercase' 
    },
    disclaimerContent: { 
        padding: SPACING.xlarge 
    },
    disclaimerHeader: { 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide,
        marginBottom: SPACING.regular,
        textTransform: 'uppercase',
    },
    disclaimerText: { 
        lineHeight: TYPOGRAPHY.fontSize.bodyLarge * 1.5,
        marginBottom: SPACING.xlarge 
    },
    checkboxContainer: { 
        marginBottom: SPACING.xlarge, 
        alignSelf: 'flex-start',
    },
    continueButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: { 
        opacity: 0.5 
    },
});

export default WelcomeAndDisclaimer;
