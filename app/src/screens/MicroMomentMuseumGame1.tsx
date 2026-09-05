import React from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../layout';
import { Typography, SquishyButton, GlassCard } from '../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const ExhibitImage = () => (
    <View style={styles.exhibitContainer}>
        <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuq3SI9wxecuDq67gvyWqWOEAKXZZuG7pAbmv3Kriz9WwQ9-M7bBxu_7iiO-QWT0nI_8ruf0hcXAX4HCnSILNgHGMRoxA9hqKsxPxS-74HOT21tChUqr_AUNx-iLWJ3uug4ZRgotG9WSbLKz6sg8gsxOnUZCxUVm-YGb03jo0IzFxJxtf21TFbc5AhVx32TPzr_dutv-fXbhkgpqfFJRWiOXsvdRgIxd2HoGQoPTKVn1toD8RU6R9vLJAWyFA3IVAzrFHlP3OuFjxj' }}
            style={styles.exhibitImage}
        />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.imageOverlay} />
        <View style={styles.exhibitTextContainer}>
            <Typography variant="label" style={styles.exhibitTag}>Micro-Moment</Typography>
            <Typography variant="headerMedium" style={styles.exhibitTitle}>The Tactile Connection</Typography>
        </View>
    </View>
);

const CuratorInsight = () => (
    <GlassCard style={styles.insightCard}>
        <Typography variant="bodyMedium" style={styles.insightTitle}>Marcie's Curator Insight</Typography>
        <Typography variant="bodyMedium" style={styles.insightText}>"The tactile connection recorded at the bakery... A testament to the silent pact made over sourdough."</Typography>
    </GlassCard>
);

const EditorPanel = () => (
    <GlassCard style={styles.editorPanel}>
        <Typography variant="headerSmall" style={styles.editorTitle}>Caption Editor</Typography>
        <TextInput 
            style={styles.captionInput}
            placeholder="Describe this moment together..."
            placeholderTextColor={COLORS.textHint}
            multiline
        />
        <SquishyButton title="Finalize Exhibit" onPress={() => {}} />
    </GlassCard>
);

const MicroMomentMuseumGame1 = () => {
    return (
        <ScreenLayout scrollable={true}>
            <Typography variant="displaySmall" style={styles.pageTitle}>Exhibit 07: The Great Carb Heist</Typography>
            
            <View style={styles.mainContent}>
                <View style={styles.leftColumn}>
                    <ExhibitImage />
                    <CuratorInsight />
                </View>
                <View style={styles.rightColumn}>
                    <EditorPanel />
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    pageTitle: { 
        textAlign: 'center', 
        marginBottom: SPACING.regular, 
        color: COLORS.vibrantPink 
    },
    mainContent: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    leftColumn: { 
        flex: 2, 
        gap: SPACING.regular 
    },
    rightColumn: { 
        flex: 1 
    },
    exhibitContainer: { 
        borderRadius: BORDER_RADIUS.xlarge, 
        overflow: 'hidden', 
        borderWidth: 1, 
        borderColor: COLORS.glowPink 
    },
    exhibitImage: { 
        width: '100%', 
        height: 250 
    },
    imageOverlay: { 
        ...StyleSheet.absoluteFillObject 
    },
    exhibitTextContainer: { 
        position: 'absolute', 
        bottom: SPACING.medium, 
        left: SPACING.medium 
    },
    exhibitTag: { 
        backgroundColor: COLORS.vibrantPink, 
        color: COLORS.textPrimary, 
        paddingHorizontal: SPACING.small, 
        paddingVertical: SPACING.tiny, 
        borderRadius: BORDER_RADIUS.medium, 
        textTransform: 'uppercase', 
        alignSelf: 'flex-start' 
    },
    exhibitTitle: { 
        color: COLORS.textPrimary, 
        marginTop: SPACING.tiny 
    },
    insightCard: { 
        padding: SPACING.regular 
    },
    insightTitle: { 
        color: COLORS.vibrantPink, 
        fontWeight: 'bold', 
        marginBottom: SPACING.small 
    },
    insightText: { 
        color: COLORS.textSecondary, 
        fontStyle: 'italic' 
    },
    editorPanel: { 
        flex: 1 
    },
    editorTitle: { 
        marginBottom: SPACING.regular 
    },
    captionInput: { 
        backgroundColor: COLORS.backgroundInput, 
        color: COLORS.textPrimary, 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        height: 100, 
        textAlignVertical: 'top', 
        marginBottom: SPACING.regular 
    },
});

export default MicroMomentMuseumGame1;
