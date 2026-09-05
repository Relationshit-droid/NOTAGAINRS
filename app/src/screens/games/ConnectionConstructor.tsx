import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout, Header, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const attachmentBlocks = [
    { name: 'Consistency', type: 'Foundation Element', icon: 'view_in_ar' },
    { name: 'Reassurance', type: 'Core Support', icon: 'shield_with_heart' },
    { name: 'Validation', type: 'Connector', icon: 'check_circle' },
    { name: 'Boundaries', type: 'Structural Safety', icon: 'grid_view' },
];

const AttachmentBlock = ({ block }: { block: { name: string, type: string, icon: string } }) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={styles.block}
    >
        <Typography variant="h2" style={styles.blockIcon}>{block.icon}</Typography>
        <View>
            <Typography variant="body" style={styles.blockName}>{block.name}</Typography>
            <Typography variant="caption" style={styles.blockType}>{block.type}</Typography>
        </View>
    </LinearGradient>
);

const ConnectionConstructorScreen = () => {
    const [safetyLevel, setSafetyLevel] = useState(68);

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.richPlum]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Build your connection with essential elements! Construct a safe and secure relationship.</Typography>
                </View>
            </View>
            
            <Header title="Connection Constructor" />
            <View style={styles.mainLayout}>
                <LinearGradient
                    colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                    start={GRADIENTS.primary.start}
                    end={GRADIENTS.primary.end}
                    style={styles.toolbox}
                >
                    <Typography variant="h2" style={styles.toolboxTitle}>The Toolbox</Typography>
                    <ScrollView>
                        {attachmentBlocks.map((block, index) => <AttachmentBlock key={index} block={block} />)}
                    </ScrollView>
                </LinearGradient>
                <View style={styles.blueprintArea}>
                    <View style={styles.blueprintGrid} />
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.dropZone}
                    >
                        <Typography variant="body" style={styles.dropZoneText}>Drop Block Here</Typography>
                    </LinearGradient>
                    <LinearGradient
                        colors={[COLORS.warmOrange, COLORS.brightYellow]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.safetyBarContainer}
                    >
                        <Typography variant="h2" style={styles.safetyBarTitle}>Relationship Safety Level</Typography>
                        <View style={styles.safetyBar}>
                            <LinearGradient 
                                colors={GRADIENTS.primary.colors} 
                                start={GRADIENTS.primary.start} 
                                end={GRADIENTS.primary.end} 
                                style={[styles.progressFill, { width: `${safetyLevel}%` }]}
                            />
                        </View>
                         <Typography variant="h2" style={styles.safetyPercentage}>{safetyLevel}%</Typography>
                    </LinearGradient>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundSecondary },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        margin: SPACING.regular,
        marginBottom: SPACING.small,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover',
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
    mainLayout: { flexDirection: 'row', flex: 1 },
    toolbox: { 
        width: 220, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    toolboxTitle: { 
        color: COLORS.textPrimary, 
        marginBottom: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    block: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: BORDER_RADIUS.large, 
        padding: SPACING.regular, 
        marginBottom: SPACING.regular,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.small,
    },
    blockIcon: { 
        color: COLORS.textPrimary, 
        marginRight: SPACING.regular,
    },
    blockName: { 
        color: COLORS.textPrimary, 
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    blockType: { 
        color: COLORS.textSecondary, 
        textTransform: 'uppercase',
    },
    blueprintArea: { flex: 1, padding: SPACING.regular, justifyContent: 'center', alignItems: 'center' },
    blueprintGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
    dropZone: { 
        width: '80%', 
        height: 300, 
        borderRadius: BORDER_RADIUS.xxlarge, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        borderStyle: 'dashed',
        ...SHADOWS.large,
    },
    dropZoneText: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    safetyBarContainer: { 
        position: 'absolute', 
        bottom: SPACING.xlarge, 
        width: '90%', 
        padding: SPACING.regular, 
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    safetyBarTitle: { 
        color: COLORS.textPrimary, 
        textTransform: 'uppercase',
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    safetyBar: { 
        height: 12, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.round, 
        marginTop: SPACING.small, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderSubtle,
    },
    safetyPercentage: { 
        position: 'absolute', 
        right: SPACING.regular, 
        top: SPACING.regular, 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    progressFill: {
        height: '100%',
    },
});

export default ConnectionConstructorScreen;
