import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function LayersOfHurt({ route, navigation }: any) {
	const { gameId } = route.params ?? {};
	const [box, setBox] = useState(1);
	const [score, setScore] = useState(0);

	// Get game info from registry
	const gameInfo = getGameByScreen('LayersOfHurt');
	const GAME_ID = gameInfo?.id || 'layers-of-hurt';
	const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';

	// Backend session
	const {
		session,
		updateScore,
		completeGame,
		isLoading,
		isSyncing
	} = useGameSession(GAME_ID, CATEGORY_ID);

	useEffect(() => {
		speakMarcie("Welcome to The Layers of Hurt Escape Room. You're not escaping a room, you're escaping repetition.");
	}, []);

	async function unlock() {
		HapticFeedbackSystem.success();
		const layerScore = box * 150;
		const newScore = score + layerScore;
		setScore(newScore);

		// Update score during gameplay
		await updateScore(newScore, [{ layer: box, score: layerScore }]);

		if (box === 1) {
			speakMarcie("Social Betrayal Unlocked. Key found: 'United Front'.");
			setBox(2);
		} else if (box === 2) {
			speakMarcie("Digital Deception Unlocked. Key found: 'Radical Transparency'.");
			setBox(3);
		} else {
			speakMarcie("Grief Unlocked. Final Key: 'Honest Grief'.");
			finish(newScore);
		}
	}

	async function finish(finalScore: number) {
		await completeGame(finalScore, [
			{ layer: 1, unlocked: true },
			{ layer: 2, unlocked: true },
			{ layer: 3, unlocked: true },
			{ totalLayers: 3, completed: true }
		]);

		Alert.alert("Freedom", "Escape Artists Status: Granted.", [
			{ text: "Collect XP", onPress: () => navigation.goBack() }
		]);
	}

	// Loading state
	if (isLoading) {
		return (
			<ScreenLayout showMarcie={true} marcieQuote="Loading escape room...">
				<View style={styles.loadingContainer}>
					<Typography variant="body" center>Initializing session...</Typography>
				</View>
			</ScreenLayout>
		);
	}

	const inputArea = (
		<ScrollView style={styles.scrollView}>
			<GlassCard>
				{isSyncing && (
					<View style={styles.syncIndicator}>
						<Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
					</View>
				)}

				<Typography variant="h2">
					Layer {box}: {box === 1 ? 'Social Betrayal' : box === 2 ? 'Digital Deception' : 'The Grieving'}
				</Typography>

				{box === 1 && (
					<View>
						<Typography variant="body" style={styles.instruction}>
							Identity the Breach Point & Choose Coping Statement.
						</Typography>
						<SquishyButton onPress={unlock} style={styles.actionBtn}>
							<Typography variant="body">Select: "Coworker's Partner" + "We are a team"</Typography>
						</SquishyButton>
					</View>
				)}

				{box === 2 && (
					<View>
						<Typography variant="body" style={styles.instruction}>
							Unscramble the Digital Rule.
						</Typography>
						<SquishyButton onPress={unlock} style={styles.actionBtn}>
							<Typography variant="body">Code: TRANSPARENCY</Typography>
						</SquishyButton>
					</View>
				)}

				{box === 3 && (
					<View>
						<Typography variant="body" style={styles.instruction}>
							Burn the blurred memories.
						</Typography>
						<SquishyButton onPress={unlock} style={styles.actionBtn}>
							<Typography variant="body">Action: Admit Loss + Hope for Earned Safety</Typography>
						</SquishyButton>
					</View>
				)}

			</GlassCard>
		</ScrollView>
	);

	const baseState = useMemo(() => ({
		id: gameId,
		title: 'Layers of Hurt Escape Room',
		description: 'Escape the debris field',
		category: 'arcade' as const,
		difficulty: 'hard' as const,
		xpReward: 500,
		currentStep: box,
		totalTime: 400,
		playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
	}), [gameId, box]);

	return <GameContainer state={baseState} inputs={["custom"]} inputArea={inputArea} onComplete={() => finish(score)} />;
}

const styles = StyleSheet.create({
	scrollView: {
		gap: SPACING.small,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	syncIndicator: {
		position: 'absolute',
		top: SPACING.small,
		right: SPACING.small,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		paddingHorizontal: SPACING.small,
		paddingVertical: SPACING.tiny,
		borderRadius: BORDER_RADIUS.small,
		zIndex: 1000,
	},
	instruction: {
		marginTop: SPACING.medium,
		marginBottom: SPACING.medium,
	},
	actionBtn: {
		marginTop: SPACING.large,
		backgroundColor: COLORS.success,
		padding: SPACING.large,
		borderRadius: BORDER_RADIUS.large,
		alignItems: 'center',
		marginBottom: SPACING.large,
	},
});
