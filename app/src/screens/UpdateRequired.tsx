import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
    {
        icon: '✨',
        color: COLORS.brightYellow,
        title: "NEW 'DEEP CONNECTION' DECK",
        description: 'Discover 50+ new questions for intimate evenings and meaningful talks.'
    },
    {
        icon: '🎨',
        color: COLORS.vibrantPink,
        title: 'LUMINOUS UI ENHANCEMENTS',
        description: 'Complete visual overhaul with modern cosmic gradients and smoother flow.'
    },
    {
        icon: '🔄',
        color: COLORS.info,
        title: 'IMPROVED SYNC FOR COUPLES',
        description: 'Real-time response tracking and shared progress insights.'
    }
];

const FeatureItem = ({ feature }: { feature: typeof features[0] }) => (
    <View style={styles.featureItem}>
        <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
            <Typography variant="h3" style={styles.featureIcon}>{feature.icon}</Typography>
        </View>
        <View style={{ flex: 1 }}>
            <Typography variant="h4" style={styles.featureTitle}>{feature.title}</Typography>
            <Typography variant="small" style={styles.featureDescription}>{feature.description}</Typography>
        </View>
    </View>
);

const UpdateRequired = () => {
    return (
        <ScreenLayout showMarcie={false}>
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient colors={[COLORS.deepCosmic, COLORS.richPlum]} style={styles.container}>
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <GlassCard style={styles.card}>
                            <Typography variant="h1" style={styles.headerTitle}>A NEW CHAPTER AWAITS</Typography>
                            <Typography variant="body" style={styles.headerSubtitle}>UPDATE REQUIRED: VERSION 2.4 IS NOW AVAILABLE</Typography>

                            <Typography variant="label" style={styles.sectionHeader}>WHAT'S NEW IN 2.4</Typography>
                            
                            <View style={styles.featuresList}>
                                {features.map((item, index) => <FeatureItem key={index} feature={item} />)}
                            </View>

                            <SquishyButton 
                                onPress={() => {}}
                                variant="primary"
                                size="large"
                                style={styles.updateButton}
                            >
                                <Typography variant="h2" style={styles.emoji}>🚀</Typography>
                                <Typography variant="button" style={styles.updateButtonText}>UPDATE NOW</Typography>
                            </SquishyButton>
                            <Typography variant="body" style={styles.patchNotes}>VIEW PATCH NOTES</Typography>
                            <Typography variant="small" style={styles.updateDetails}>ESTIMATED SIZE: 45MB</Typography>
                        </GlassCard>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.deepCosmic 
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: SPACING.lg 
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: { 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.xlarge, 
        padding: SPACING.xlarge, 
        borderWidth: 1, 
        borderColor: `${COLORS.vibrantPink}50` 
    },
    headerTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        textTransform: 'uppercase' 
    },
    headerSubtitle: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        marginBottom: SPACING.xl, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    sectionHeader: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        letterSpacing: TYPOGRAPHY.letterSpacing.wide, 
        marginBottom: SPACING.lg 
    },
    featuresList: { 
        marginBottom: SPACING.xl 
    },
    featureItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.md, 
        marginBottom: SPACING.sm 
    },
    featureIconContainer: { 
        width: 48, 
        height: 48, 
        borderRadius: BORDER_RADIUS.medium, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: SPACING.md 
    },
    featureIcon: {
        fontSize: TYPOGRAPHY.fontSize.headerLarge,
    },
    featureTitle: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    featureDescription: { 
        color: COLORS.textSecondary, 
        marginTop: TYPOGRAPHY.fontSize.bodySmall * 0.15 
    },
    updateButton: { 
        flexDirection: 'row', 
        backgroundColor: COLORS.vibrantPink, 
        padding: SPACING.lg, 
        borderRadius: BORDER_RADIUS.large, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    emoji: {
        fontSize: TYPOGRAPHY.fontSize.headerLarge,
    },
    updateButtonText: { 
        color: COLORS.textPrimary, 
        fontWeight: 'bold', 
        fontSize: TYPOGRAPHY.fontSize.button, 
        marginLeft: SPACING.sm, 
        textTransform: 'uppercase' 
    },
    patchNotes: { 
        color: COLORS.textSecondary, 
        textAlign: 'center', 
        textDecorationLine: 'underline', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
    },
    updateDetails: { 
        color: COLORS.textSecondary, 
        fontSize: TYPOGRAPHY.fontSize.bodySmall, 
        textAlign: 'center', 
        marginTop: SPACING.xs, 
        opacity: 0.7 
    }
});

export default UpdateRequired;
