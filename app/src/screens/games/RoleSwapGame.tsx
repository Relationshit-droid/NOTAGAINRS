import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Mock data for the chat
const initialMessages = [
    {
        id: 1, user: 'Partner A', as: 'Alex', text: "Why do you always leave your socks on the nebula floor? It's like a black hole of laundry!", userColor: COLORS.emotionalConnection
    },
    {
        id: 2, user: 'Partner B', as: 'Jordan', text: "I'm just creating a gravitational pull for the washing machine, honey! It's 'functional space clutter'.", userColor: COLORS.lavenderPurple, isSelf: true
    },
];

const RoleSwapGame = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const score = 88;

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = { 
                id: messages.length + 1, 
                user: 'Partner B', 
                as: 'Jordan', 
                text: inputText, 
                userColor: COLORS.lavenderPurple, 
                isSelf: true 
            };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    return (
        <ScreenLayout showHeader={false} scrollable={false}>
            <View style={styles.header}>
                <Typography variant="h1" center>Role Swap</Typography>
                <Typography variant="h2" center style={styles.subtitleText}>Step Into Their Shoes</Typography>
            </View>

            <ScrollView style={styles.chatContainer}>
                {messages.map(msg => (
                    <View key={msg.id} style={[styles.messageRow, msg.isSelf ? styles.messageRowSelf : {}]}>
                        <GlassCard 
                            style={[
                                styles.messageBubble, 
                                msg.isSelf ? styles.messageBubbleSelf : {}, 
                                { borderColor: msg.userColor }
                            ]}
                        >
                            <Typography variant="caption" style={[styles.userLabel, { color: msg.userColor }]}>
                                {msg.user} as {msg.as}
                            </Typography>
                            <Typography variant="body">{msg.text}</Typography>
                        </GlassCard>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputSection}>
                <View style={styles.scoreBarContainer}>
                    <Typography variant="caption" style={styles.scoreLabel}>AI Perspective Score: {score}%</Typography>
                    <View style={styles.scoreBarBackground}>
                        <View style={[styles.scoreBar, { width: `${score}%` }]} />
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your performance..."
                        placeholderTextColor={COLORS.textHint}
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <SquishyButton onPress={handleSend} style={styles.sendButton}>
                        <MaterialIcons name="send" size={22} color={COLORS.backgroundPrimary} />
                    </SquishyButton>
                </View>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    header: { 
        padding: SPACING.large, 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderColor: COLORS.borderSubtle 
    },
    subtitleText: {
        color: COLORS.lavenderPurple
    },
    chatContainer: { 
        flex: 1, 
        padding: SPACING.regular 
    },
    messageRow: { 
        flexDirection: 'row', 
        marginBottom: SPACING.regular 
    },
    messageRowSelf: { 
        justifyContent: 'flex-end' 
    },
    messageBubble: { 
        maxWidth: '80%', 
        borderLeftWidth: 4, 
        borderLeftColor: COLORS.emotionalConnection 
    },
    messageBubbleSelf: { 
        borderLeftWidth: 0, 
        borderRightWidth: 4, 
        borderRightColor: COLORS.lavenderPurple 
    },
    userLabel: {
    },
    inputSection: { 
        padding: SPACING.regular, 
        borderTopWidth: 1, 
        borderColor: COLORS.borderSubtle 
    },
    scoreBarContainer: { 
        marginBottom: SPACING.regular 
    },
    scoreLabel: { 
        color: COLORS.emotionalConnection, 
        marginBottom: SPACING.tiny 
    },
    scoreBarBackground: { 
        height: 8, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.small 
    },
    scoreBar: { 
        height: '100%', 
        backgroundColor: COLORS.emotionalConnection, 
        borderRadius: BORDER_RADIUS.small 
    },
    inputRow: { 
        flexDirection: 'row', 
        gap: SPACING.regular 
    },
    textInput: { 
        flex: 1, 
        height: 50, 
        backgroundColor: COLORS.backgroundInput, 
        borderRadius: BORDER_RADIUS.large, 
        paddingHorizontal: SPACING.regular, 
        color: COLORS.textPrimary 
    },
    sendButton: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.large, 
        backgroundColor: COLORS.emotionalConnection, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: SPACING.none,
        minHeight: 50
    },
});

export default RoleSwapGame;
