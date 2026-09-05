import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATIONS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const FilterOption = ({ label, options }: { label: string, options: string[] }) => (
    <View style={styles.filterGroup}>
        <Typography variant="label" style={styles.filterLabel}>{label}</Typography>
        <View style={styles.pickerContainer}>
            <Picker style={styles.picker} dropdownIconColor={COLORS.textPrimary}>
                {options.map(opt => <Picker.Item key={opt} label={opt} value={opt.toLowerCase()} color={COLORS.textPrimary} />)}
            </Picker>
        </View>
    </View>
);

const DateNightRouletteGame2Screen = () => {
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
            
            <View style={styles.mainLayout}>
                {/* Left Sidebar */}
                <GlassCard style={styles.sidebar} padding="large">
                    <Typography variant="h2" style={styles.sidebarTitle}>Date Night Roulette</Typography>
                    <Typography variant="caption" style={styles.sidebarSubtitle}>Fine-tune your spin parameters</Typography>
                    <FilterOption label="Budget Preference" options={["Select Budget", "$ - Thrifty & Fun"]}/>
                    <FilterOption label="Energy Level" options={["Chill, Active, or Spicy", "Chill - Low Energy"]}/>
                    <FilterOption label="Vibe Check" options={["Select Theme", "Romantic Evening"]}/>
                </GlassCard>

                {/* Center Content */}
                <View style={styles.centerContent}>
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.wheelContainer}
                    >
                        <View style={styles.wheelPointer} />
                        <View style={styles.wheel}>
                             <LinearGradient
                                colors={GRADIENTS.primary.colors}
                                start={GRADIENTS.primary.start}
                                end={GRADIENTS.primary.end}
                                style={styles.innerWheelCircle}
                             />
                        </View>
                    </LinearGradient>
                    <SquishyButton style={styles.spinButton} size="large">
                        <Typography variant="button">SPIN THE WHEEL</Typography>
                    </SquishyButton>
                </View>

                {/* Dr. Marcie Overlay */}
                <GlassCard style={styles.marcieOverlay} padding="medium">
                    <LinearGradient
                        colors={GRADIENTS.primary.colors}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.clipboard}
                    >
                        <Typography variant="caption" style={styles.clipboardTitle}>Dr. Marcie's Advice</Typography>
                        <Typography variant="h3" style={styles.clipboardHeading}>Connection is the key!</Typography>
                        <Typography variant="sass" style={styles.clipboardText}>"Remember, it's not about how much you spend, but how much you engage..."</Typography>
                    </LinearGradient>
                </GlassCard>
            </View>
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
    mainLayout: { 
        flex: 1, 
        flexDirection: 'row' 
    },
    sidebar: { 
        width: 300, 
        borderRightWidth: 1, 
        borderRightColor: COLORS.divider,
        ...SHADOWS.card
    },
    sidebarTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    sidebarSubtitle: { 
        color: COLORS.textSecondary,
        marginBottom: SPACING.xlarge,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    filterGroup: { 
        marginBottom: SPACING.regular 
    },
    filterLabel: { 
        color: COLORS.vibrantPink,
        marginBottom: SPACING.small,
        backgroundColor: 'rgba(219, 20, 124, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    pickerContainer: { 
        backgroundColor: 'rgba(26,43,41,0.5)', 
        borderRadius: BORDER_RADIUS.large, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle,
    },
    picker: { 
        height: SPACING.xxlarge + SPACING.small, 
        width: '100%', 
        color: COLORS.textPrimary 
    },
    centerContent: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: SPACING.xxlarge 
    },
    wheelContainer: { 
        width: 400, 
        height: 400, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: SPACING.xxlarge,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
    wheelPointer: { 
        position: 'absolute', 
        top: -SPACING.small, 
        width: SPACING.large + SPACING.small, 
        height: SPACING.xlarge, 
        backgroundColor: COLORS.vibrantPink, 
        zIndex: 3, 
        borderBottomLeftRadius: BORDER_RADIUS.large, 
        borderBottomRightRadius: BORDER_RADIUS.large 
    },
    wheel: { 
        width: '100%', 
        height: '100%', 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: SPACING.small, 
        borderColor: COLORS.backgroundSecondary, 
        backgroundColor: 'rgba(34,58,55,0.5)',
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
    innerWheelCircle: { 
        width: SPACING.xxxlarge + SPACING.large, 
        height: SPACING.xxxlarge + SPACING.large, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card
    },
    spinButton: { 
        width: '100%', 
        maxWidth: 350, 
        ...SHADOWS.buttonGlow
    },
    marcieOverlay: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        width: 450, 
        height: 500, 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        ...SHADOWS.card
    },
    clipboard: {
        position: 'absolute', 
        right: 350, 
        bottom: SPACING.xxlarge,
        width: 280, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.large, 
        transform: [{ rotate: '-3deg' }],
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large
    },
    clipboardTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.small,
    },
    clipboardHeading: { 
        color: COLORS.textPrimary,
        marginVertical: SPACING.small,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    clipboardText: { 
        color: COLORS.textPrimary,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.small,
    },
});

export default DateNightRouletteGame2Screen;
