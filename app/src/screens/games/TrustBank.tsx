/**
 * Trust Bank - Healing Hospital Game
 * Couples track trust deposits and withdrawals
 * 
 * Backend Integration:
 * - Creates game session via useGameSession
 * - Tracks all transactions
 * - Calculates final balance
 */

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '../../components/ui';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Components
import { GlassCard, Typography, SquishyButton } from '../../components/ui';

// Theme
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Game Constants
const GAME_ID = 'trust-bank';
const CATEGORY_ID = 'healing-hospital';

type Transaction = { 
    id: string;
    type: 'deposit' | 'withdrawal'; 
    description: string; 
    amount: number;
    timestamp: number;
};

const TrustBank: React.FC = () => {
    const navigation = useNavigation();
    
    // Backend session
    const { 
        session, 
        updateScore, 
        completeGame, 
        isLoading: sessionLoading, 
        isSyncing 
    } = useGameSession(GAME_ID, CATEGORY_ID);

    // Game state
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('10');
    const [gameCompleted, setGameCompleted] = useState(false);

    // Add transaction
    const addTransaction = async (type: 'deposit' | 'withdrawal') => {
        const val = parseInt(amount) || 0;
        if (val <= 0 || !description.trim()) {
            Alert.alert('Required', 'Please enter a description and amount');
            return;
        }

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            type,
            description: description.trim(),
            amount: val,
            timestamp: Date.now()
        };

        const newTransactions = [newTransaction, ...transactions];
        setTransactions(newTransactions);
        
        const newBalance = type === 'deposit' ? balance + val : balance - val;
        setBalance(newBalance);
        
        // Save to backend
        await updateScore(Math.abs(newBalance), false, [{
            transaction: newTransaction,
            newBalance,
            totalTransactions: newTransactions.length
        }]);

        setDescription('');
        setAmount('10');
    };

    // Finish game
    const finishGame = async () => {
        setGameCompleted(true);
        
        let badge = 'Accountant';
        if (balance >= 100) badge = 'Trust Investor';
        else if (balance >= 50) badge = 'Savings Builder';
        else if (balance >= 0) badge = 'Breaking Even';
        else badge = 'Overdrawn';

        await completeGame(Math.abs(balance), [{
            completed: true,
            badge,
            finalBalance: balance,
            totalTransactions: transactions.length
        }]);

        Alert.alert(
            'Trust Bank Closed! 🏦',
            `Final Balance: ${balance >= 0 ? '+' : ''}${balance}\nBadge: ${badge}\n\n${transactions.length} transactions recorded`,
            [
                { 
                    text: 'View Results', 
                    onPress: () => navigation.navigate('GameResults', { 
                        score: Math.abs(balance), 
                        badge,
                        gameId: GAME_ID,
                        sessionId: session?.id 
                    }) 
                },
                { text: 'Exit', onPress: () => navigation.goBack() }
            ]
        );
    };

    // Loading state
    if (sessionLoading) {
        return (
            <ScreenLayout showHeader={false} scrollable={true}>
                <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.healingHospital]} style={styles.background}>
                    <Typography variant="body" center style={styles.loadingText}>
                        Opening Trust Bank...
                    </Typography>
                </LinearGradient>
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundSecondary, COLORS.healingHospital]} style={styles.background}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Typography variant="h1" center>
                                The Love Arcade
                            </Typography>
                            <Typography variant="h2" center style={styles.subtitle}>
                                +100 Games to Deepen Connection
                            </Typography>
                        </View>

                        <Typography variant="h3" center style={styles.gameTitle}>
                            Trust Bank
                        </Typography>
                        <Typography variant="body" center style={styles.gameSubtitle}>
                            Log your trust deposits & withdrawals
                        </Typography>

                        {/* Balance Display */}
                        <GlassCard style={styles.balanceCard}>
                            <Typography variant="caption" style={styles.balanceLabel}>
                                Current Balance
                            </Typography>
                            <Typography 
                                variant="gameTitle" 
                                style={[
                                    styles.balanceAmount,
                                    { color: balance >= 0 ? COLORS.success : COLORS.error }
                                ]}
                            >
                                {balance >= 0 ? '+' : ''}{balance}
                            </Typography>
                            {isSyncing && (
                                <Typography variant="caption" style={styles.syncText}>
                                    💾 Saving...
                                </Typography>
                            )}
                        </GlassCard>

                        {/* Transaction Form */}
                        <GlassCard style={styles.formCard}>
                            <Typography variant="h4" style={styles.formLabel}>
                                New Transaction
                            </Typography>
                            
                            <TextInput
                                style={styles.input}
                                placeholder="What happened? (e.g., 'Listened without interrupting')"
                                placeholderTextColor={COLORS.textHint}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                            
                            <TextInput
                                style={styles.amountInput}
                                placeholder="Amount (1-100)"
                                placeholderTextColor={COLORS.textHint}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            <View style={styles.buttonRow}>
                                <SquishyButton 
                                    onPress={() => addTransaction('deposit')}
                                    variant="primary"
                                    style={styles.actionButton}
                                >
                                    <Typography variant="button" style={styles.depositButtonText}>
                                        + Deposit
                                    </Typography>
                                </SquishyButton>
                                
                                <SquishyButton 
                                    onPress={() => addTransaction('withdrawal')}
                                    variant="ghost"
                                    style={styles.actionButton}
                                >
                                    <Typography variant="button">- Withdrawal</Typography>
                                </SquishyButton>
                            </View>
                        </GlassCard>

                        {/* Transaction History */}
                        <Typography variant="h4" style={styles.historyTitle}>
                            Transaction History
                        </Typography>
                        
                        {transactions.length === 0 ? (
                            <Typography variant="body" center style={styles.emptyText}>
                                No transactions yet. Start building trust!
                            </Typography>
                        ) : (
                            transactions.map((t) => (
                                <View key={t.id} style={styles.transactionRow}>
                                    <View style={[
                                        styles.typeIndicator,
                                        { backgroundColor: t.type === 'deposit' ? COLORS.success : COLORS.error }
                                    ]}>
                                        <Typography variant="h4" style={styles.typeText}>
                                            {t.type === 'deposit' ? '+' : '-'}
                                        </Typography>
                                    </View>
                                    <View style={styles.transactionInfo}>
                                        <Typography variant="body" style={styles.transactionDesc}>
                                            {t.description}
                                        </Typography>
                                        <Typography variant="button" style={styles.transactionAmount}>
                                            {t.type === 'deposit' ? '+' : '-'}{t.amount}
                                        </Typography>
                                    </View>
                                </View>
                            ))
                        )}

                        {/* Finish Button */}
                        {transactions.length > 0 && (
                            <SquishyButton 
                                onPress={finishGame}
                                size="large"
                                style={styles.finishButton}
                            >
                                <Typography variant="button">
                                    Close Account & Finish
                                </Typography>
                            </SquishyButton>
                        )}

                        {session && (
                            <Typography variant="caption" center style={styles.sessionInfo}>
                                Session: {session.id.slice(0, 8)}...
                            </Typography>
                        )}
                    </ScrollView>
            </LinearGradient>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.screenPadding,
        paddingTop: SPACING.xxxlarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.regular,
    },
    subtitle: {
        marginTop: SPACING.small,
    },
    gameTitle: {
        marginTop: SPACING.large,
        marginBottom: SPACING.small,
    },
    gameSubtitle: {
        marginBottom: SPACING.large,
    },
    loadingText: {
        marginTop: 100,
    },
    balanceCard: {
        padding: SPACING.xxlarge,
        marginBottom: SPACING.xlarge,
        alignItems: 'center',
    },
    balanceLabel: {
        marginBottom: SPACING.regular,
    },
    balanceAmount: {
        fontSize: TYPOGRAPHY.fontSize.displayLarge,
    },
    syncText: {
        marginTop: SPACING.regular,
    },
    formCard: {
        padding: SPACING.xlarge,
        marginBottom: SPACING.xlarge,
    },
    formLabel: {
        color: COLORS.brightYellow,
        marginBottom: SPACING.regular,
    },
    input: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.input,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyMedium,
        marginBottom: SPACING.regular,
        minHeight: 60,
    },
    amountInput: {
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.input,
        padding: SPACING.regular,
        color: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.fontSize.bodyLarge,
        marginBottom: SPACING.large,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.regular,
    },
    actionButton: {
        flex: 1,
    },
    depositButtonText: {
        color: COLORS.textPrimary,
    },
    historyTitle: {
        marginBottom: SPACING.regular,
    },
    emptyText: {
        marginBottom: SPACING.xlarge,
    },
    transactionRow: {
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.large,
        marginBottom: SPACING.small,
    },
    typeIndicator: {
        width: 30,
        height: 30,
        borderRadius: BORDER_RADIUS.round,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    typeText: {
        color: COLORS.textPrimary,
    },
    transactionInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionDesc: {
        flex: 1,
    },
    transactionAmount: {
        color: COLORS.textPrimary,
    },
    finishButton: {
        marginTop: SPACING.xlarge,
    },
    sessionInfo: {
        marginTop: SPACING.xxlarge,
    },
});

export default TrustBank;
