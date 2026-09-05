
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenLayout from '../layout/ScreenLayout';
import Typography from '../components/ui/Typography';
import SquishyButton from '../components/ui/SquishyButton';
import GlassCard from '../components/ui/GlassCard';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';

const categories = ['OUR FIRSTS', 'PET PEEVES', 'DREAM VACAY', 'DEEP SECRETS', 'FUTURE US'];
const values = [100, 200, 300, 400, 500];

type JeopardyTileProps = {
    value: number;
    category: string;
    onSelect: (category: string, value: number) => void;
};

const JeopardyTile = ({ value, category, onSelect }: JeopardyTileProps) => {
    const [selected, setSelected] = useState(false);
    
    const handlePress = () => {
        if (!selected) {
            onSelect(category, value);
            setSelected(true);
        }
    };
    
    return (
        <SquishyButton 
            variant={selected ? 'secondary' : 'ghost'}
            onPress={handlePress} 
            style={[styles.tile, selected && styles.tileSelected]}
        >
            <Typography variant="h3" style={[styles.tileValue, selected && styles.tileValueSelected]}>${value}</Typography>
        </SquishyButton>
    );
};

type PlayerPodProps = { name: string; score: number; color: string };

const PlayerPod = ({ name, score, color }: PlayerPodProps) => (
    <GlassCard style={[styles.pod, {borderColor: color}]}>
        <Typography variant="h3" style={styles.playerName}>{name}</Typography>
        <Typography variant="h1" style={styles.playerScore}>${score}</Typography>
    </GlassCard>
);

const TranslatorActionPlan10 = () => {
    const [scores, setScores] = useState({ alex: 1200, jordan: 800 });
    const [currentPlayer, setCurrentPlayer] = useState('alex');

    const handleSelect = (category: string, value: number) => {
        setScores(prev => ({...prev, [currentPlayer]: prev[currentPlayer] + value}));
    };

    return (
        <ScreenLayout scrollable={true} showHeader={false}>
            <Typography variant="h1" center style={styles.header}>COUPLE'S JEOPARDY</Typography>
            <View style={styles.podsContainer}>
                <PlayerPod name="ALEX" score={scores.alex} color={COLORS.info} />
                <PlayerPod name="JORDAN" score={scores.jordan} color={COLORS.vibrantPink} />
            </View>
            
            <GlassCard style={styles.board}>
                <View style={styles.categoriesContainer}>
                    {categories.map(cat => <Typography key={cat} variant="caption" style={styles.categoryText}>{cat}</Typography>)}
                </View>
                <View style={styles.tilesContainer}>
                    {categories.map(category => (
                        <View key={category} style={styles.column}>
                            {values.map(value => <JeopardyTile key={`${category}-${value}`} value={value} category={category} onSelect={handleSelect} />)}
                        </View>
                    ))}
                </View>
            </GlassCard>
            <SquishyButton onPress={() => setCurrentPlayer(p => p === 'alex' ? 'jordan' : 'alex')} style={styles.buzzButton}>
                <Typography variant="button" color={COLORS.backgroundPrimary}>BUZZ IN</Typography>
            </SquishyButton>
            <Typography variant="caption" center style={styles.currentPlayerText}>CURRENT PLAYER: {currentPlayer.toUpperCase()}</Typography>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    header: { 
        marginVertical: SPACING.regular,
        textTransform: 'uppercase' 
    },
    podsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.xlarge 
    },
    pod: { 
        alignItems: 'center', 
        width: '40%',
        borderWidth: 2,
    },
    playerName: { 
        textTransform: 'uppercase' 
    },
    playerScore: { 
    },
    board: { 
        backgroundColor: `${COLORS.backgroundPrimary}40`,
        padding: SPACING.small,
    },
    categoriesContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: SPACING.small 
    },
    categoryText: { 
        textAlign: 'center', 
        flex: 1,
        textTransform: 'uppercase',
        color: COLORS.vibrantPink,
    },
    tilesContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around' 
    },
    column: { 
        flex: 1, 
        marginHorizontal: SPACING.tiny 
    },
    tile: { 
        paddingVertical: SPACING.large, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: SPACING.small,
        minHeight: 60,
    },
    tileSelected: { 
        backgroundColor: COLORS.textHint 
    },
    tileValue: { 
        color: COLORS.brightYellow,
    },
    tileValueSelected: { 
        textDecorationLine: 'line-through', 
        color: COLORS.textHint 
    },
    buzzButton: { 
        backgroundColor: COLORS.info,
        marginHorizontal: SPACING.xxlarge, 
        marginTop: SPACING.xlarge 
    },
    currentPlayerText: { 
        marginTop: SPACING.regular,
        textTransform: 'uppercase',
    }
});

export default TranslatorActionPlan10;
