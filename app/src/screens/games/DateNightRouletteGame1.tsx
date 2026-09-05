import React from 'react';
import { View, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const DateNightRouletteGame1Screen = () => {
    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.backgroundPrimary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <GlassCard style={styles.drMarcieSection} padding="medium">
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Spin the wheel for unique date night ideas! Strengthen your connection with creative activities.</Typography>
                </View>
            </GlassCard>
            
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Typography variant="h1" center>Date Night Roulette</Typography>
                    <Typography variant="h2" center style={styles.headerSubtitle}>Where will tonight take you?</Typography>
                </View>

                <View style={styles.mainLayout}>
                    {/* Left Sidebar */}
                    <GlassCard style={styles.sidebar} padding="medium">
                        <LinearGradient
                            colors={GRADIENTS.primary.colors}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.glassPanel}
                        >
                            <Typography variant="h3" style={styles.sidebarTitle}>Set the Vibe</Typography>
                            <View style={styles.pickerContainer}>
                                <Picker style={styles.picker} dropdownIconColor={COLORS.textPrimary}>
                                    <Picker.Item label="Balanced ($$)" value="mid" color={COLORS.textPrimary} />
                                    <Picker.Item label="Thrifty ($)" value="low" color={COLORS.textPrimary} />
                                    <Picker.Item label="Bougie ($$$)" value="high" color={COLORS.textPrimary} />
                                </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker style={styles.picker} dropdownIconColor={COLORS.textPrimary}>
                                    <Picker.Item label="Casual Fun (Mid)" value="mid" color={COLORS.textPrimary} />
                                    <Picker.Item label="Netflix & Chill (Low)" value="low" color={COLORS.textPrimary} />
                                    <Picker.Item label="Adrenaline Junkie (High)" value="high" color={COLORS.textPrimary} />
                                </Picker>
                            </View>
                        </LinearGradient>
                    </GlassCard>

                    {/* Center Roulette */}
                    <View style={styles.centerContent}>
                        <LinearGradient
                            colors={[COLORS.mintGreen, COLORS.softViolet]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.wheelContainer}
                        >
                            <View style={styles.wheel} />
                            <SquishyButton style={styles.spinButton}>
                                <Typography variant="button" style={styles.spinButtonText}>SPIN</Typography>
                            </SquishyButton>
                        </LinearGradient>
                    </View>
                    
                    {/* Right Sidebar */}
                    <GlassCard style={styles.sidebar} padding="medium">
                        <LinearGradient
                            colors={GRADIENTS.primary.colors}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.speechBubble}
                        >
                            <Typography variant="sass" center>"Ooh, I love this vibe! Let's see what destiny has in store..."</Typography>
                        </LinearGradient>
                    </GlassCard>
                </View>
            </ScrollView>
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
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: SPACING.regular,
        marginBottom: SPACING.small
    },
    avatarContainer: {
        width: SPACING.xxlarge + SPACING.small,
        height: SPACING.xxlarge + SPACING.small,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular
    },
    avatar: {
        width: SPACING.xxlarge,
        height: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover'
    },
    quoteBox: {
        flex: 1,
        backgroundColor: 'rgba(252, 199, 56, 0.2)',
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular
    },
    scrollContainer: { 
        flexGrow: 1, 
        padding: SPACING.regular 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: SPACING.xlarge 
    },
    headerSubtitle: { 
        marginTop: SPACING.small, 
        opacity: 0.8 
    },
    mainLayout: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    sidebar: { 
        width: '25%',
        ...SHADOWS.card
    },
    glassPanel: { 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
    sidebarTitle: { 
        color: COLORS.textPrimary,
        marginBottom: SPACING.regular,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    pickerContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.regular,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    picker: { 
        height: SPACING.xxlarge + SPACING.small, 
        width: '100%', 
        color: COLORS.textPrimary,
    },
    centerContent: { 
        width: '45%', 
        alignItems: 'center' 
    },
    wheelContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '80%', 
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
    wheel: {
        width: '100%', 
        height: '100%', 
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: 'transparent',
        borderWidth: SPACING.small, 
        borderColor: 'rgba(255,255,255,0.1)',
    },
    spinButton: {
        position: 'absolute',
        width: SPACING.xxxlarge + SPACING.large,
        height: SPACING.xxxlarge + SPACING.large,
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center', 
        alignItems: 'center',
        ...SHADOWS.neon
    },
    spinButtonText: { 
        color: COLORS.vibrantPink,
    },
    speechBubble: { 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.large,
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
});

export default DateNightRouletteGame1Screen;
