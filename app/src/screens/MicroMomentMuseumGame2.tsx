import React from 'react';
import { View, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const ArtifactImage = () => (
    <View style={styles.artifactContainer}>
        <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGshh1GoAVFeQHjdwfKpXl9JFK6rzXCAjL8XrxqcVCfeUYAIeUC3DWT1E0fvq7MdgODLk2CE9QCFOqlYCMAFYxtuXE4epUYHFDu8zLv8Dtt-eHomplxJiXr0OvwtrNySfRf2P0T7fHES2eM8YrXNfa5mCd4HbeAtmqkGuikVB9jboKIwcCAF5r4CxIf0lRrhrqfc7Nyp54djpN6CLDvlp6-VvVpKoti19lCNdB6Wh7lPiPaGj4d5jkIX7O_f88nGrprmqt9IPD1upO' }}
            style={styles.artifactImage}
            imageStyle={{ borderRadius: BORDER_RADIUS.xlarge }}
        >
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.imageOverlay} />
            <View style={styles.artifactTextContainer}>
                <Typography variant="bodySmall" style={styles.artifactTag}>Connection Artifact #7</Typography>
                <Typography variant="displaySmall" style={styles.artifactTitle}>Hand-Holding at Midnight</Typography>
            </View>
        </ImageBackground>
    </View>
);

const CurationPanel = () => (
    <GlassCard style={styles.curationPanel}>
        <Typography variant="headerSmall" style={styles.curationTitle}>Curate the Caption</Typography>
        <TextInput 
            style={styles.captionInput}
            placeholder="Describe this micro-moment..."
            placeholderTextColor={COLORS.textHint}
            multiline
        />
        <View style={styles.meterContainer}>
            <Typography variant="bodyMedium" style={styles.meterLabel}>Warmth Meter</Typography>
            <View style={styles.meterTrack}><View style={[styles.meterFill, {width: '85%'}]} /></View>
        </View>
        <View style={styles.meterContainer}>
            <Typography variant="bodyMedium" style={styles.meterLabel}>Specificity Meter</Typography>
            <View style={styles.meterTrack}><View style={[styles.meterFill, {width: '42%', backgroundColor: COLORS.mintGreen}]} /></View>
        </View>
        <SquishyButton title="Curate This Moment" onPress={() => {}} />
    </GlassCard>
);

const MicroMomentMuseumGame2 = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="headerLarge" style={styles.pageTitle}>Micro-Moment Museum</Typography>
            <View style={styles.mainContent}>
                <View style={styles.leftColumn}>
                    <ArtifactImage />
                </View>
                <View style={styles.rightColumn}>
                    <CurationPanel />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    pageTitle: { 
        textAlign: 'center', 
        marginBottom: SPACING.regular 
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    leftColumn: { 
        flex: 1.5 
    },
    rightColumn: { 
        flex: 1 
    },
    artifactContainer: { 
        borderRadius: BORDER_RADIUS.xlarge, 
        overflow: 'hidden', 
        borderWidth: 2, 
        borderColor: COLORS.borderSubtle 
    },
    artifactImage: { 
        width: '100%', 
        height: 400, 
        justifyContent: 'flex-end' 
    },
    imageOverlay: { 
        ...StyleSheet.absoluteFillObject 
    },
    artifactTextContainer: { 
        padding: SPACING.regular 
    },
    artifactTag: { 
        color: COLORS.blushPink, 
        textTransform: 'uppercase', 
        marginBottom: SPACING.tiny 
    },
    artifactTitle: { 
        color: COLORS.textPrimary 
    },
    curationPanel: { 
        flex: 1 
    },
    curationTitle: { 
        marginBottom: SPACING.regular 
    },
    captionInput: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        color: COLORS.textPrimary, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        height: 120, 
        textAlignVertical: 'top', 
        marginBottom: SPACING.regular, 
        borderWidth: 1, 
        borderColor: COLORS.borderSubtle 
    },
    meterContainer: { 
        marginBottom: SPACING.regular 
    },
    meterLabel: { 
        marginBottom: SPACING.small 
    },
    meterTrack: { 
        height: 16, 
        backgroundColor: COLORS.borderSubtle, 
        borderRadius: BORDER_RADIUS.round 
    },
    meterFill: { 
        height: '100%', 
        backgroundColor: COLORS.blushPink, 
        borderRadius: BORDER_RADIUS.round 
    },
});

export default MicroMomentMuseumGame2;
