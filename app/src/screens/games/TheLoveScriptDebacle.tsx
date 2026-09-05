
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const falseScripts = [
    { title: "If they loved me, they'd know.", category: 'Mind Reading Script' },
    { title: 'Conflict is a sign of failure.', category: 'Avoidance Logic' },
    { title: 'Love is always easy.', category: 'Disneyfied Expectation' },
];

const LoveScriptCard = ({ script, onDeconstruct }: { script: typeof falseScripts[0], onDeconstruct: (script: typeof falseScripts[0]) => void }) => (
    <GlassCard onPress={() => onDeconstruct(script)} style={styles.card}>
        <Typography variant="h3">{script.title}</Typography>
        <Typography variant="caption" style={styles.cardCategory}>{script.category}</Typography>
    </GlassCard>
);

const TheLoveScriptDebacle = () => {
    const [scripts, setScripts] = useState(falseScripts);
    const [deconstructed, setDeconstructed] = useState<typeof falseScripts>([]);

    const handleDeconstruct = (scriptToDeconstruct: typeof falseScripts[0]) => {
        setScripts(scripts.filter(s => s.title !== scriptToDeconstruct.title));
        setDeconstructed([...deconstructed, scriptToDeconstruct]);
    };

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.deepCosmic]} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Typography variant="h1" center style={styles.header}>The Love-Script Debacle</Typography>
                    
                    <View style={styles.grid}>
                        {scripts.map(script => (
                            <LoveScriptCard key={script.title} script={script} onDeconstruct={handleDeconstruct} />
                        ))}
                    </View>

                    <GlassCard style={styles.deconstructionZone} variant="outlined">
                        <MaterialIcons name="delete-forever" size={48} color={COLORS.warmOrange} />
                        <Typography variant="h2" style={styles.zoneTitle}>Deconstruction Zone</Typography>
                        <Typography variant="body" center style={styles.zoneSubtitle}>
                            Drag false scripts here to analyze.
                        </Typography>
                        {deconstructed.length > 0 && (
                            <Typography variant="caption" style={styles.deconstructedCount}>
                                {deconstructed.length} deconstructed
                            </Typography>
                        )}
                    </GlassCard>
                </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLORS.backgroundPrimary 
    },
    scrollContent: { 
        padding: SPACING.screenPadding, 
        alignItems: 'center' 
    },
    header: { 
        marginBottom: SPACING.xlarge 
    },
    grid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: SPACING.regular, 
        marginBottom: SPACING.xlarge 
    },
    card: { 
        width: 300, 
        padding: SPACING.regular, 
    },
    cardCategory: { 
        color: COLORS.textHint, 
        textTransform: 'uppercase', 
        marginTop: SPACING.small 
    },
    deconstructionZone: {
        width: '100%',
        padding: SPACING.xxlarge,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.warmOrange,
        borderStyle: 'dashed',
        borderRadius: BORDER_RADIUS.xlarge,
        backgroundColor: COLORS.backgroundInput,
    },
    zoneTitle: { 
        color: COLORS.warmOrange, 
        textTransform: 'uppercase', 
        marginTop: SPACING.small 
    },
    zoneSubtitle: { 
        color: COLORS.textSecondary, 
        marginTop: SPACING.small 
    },
    deconstructedCount: { 
        color: COLORS.mintGreen, 
        marginTop: SPACING.regular 
    },
});

export default TheLoveScriptDebacle;
