
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import ScreenLayout from '../../layout/ScreenLayout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
// In a real app, you'd use a Firebase function to send the push notification.
// For this example, we'll just log the intended action.

const AdminPushComposer = () => {
  const [coupleId, setCoupleId] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSend = () => {
    if (!coupleId || !message) {
      setFeedback('Couple ID and message are required.');
      return;
    }
    // In a real application, you would trigger a Firebase Cloud Function here.
    console.log(`Sending push notification to couple_id: ${coupleId}`);
    console.log(`Message: ${message}`);
    setFeedback(`Push notification sent to ${coupleId}!`);
    setCoupleId('');
    setMessage('');
  };

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" style={styles.title}>Push Composer</Typography>
        <GlassCard style={styles.formCard} variant="elevated" padding="large">
          <TextInput
            style={styles.input}
            placeholder="Couple ID"
            placeholderTextColor={COLORS.textHint}
            value={coupleId}
            onChangeText={setCoupleId}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Notification Message"
            placeholderTextColor={COLORS.textHint}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <SquishyButton onPress={handleSend} style={styles.button}>
            <Typography variant="button" color={COLORS.textPrimary}>Send Notification</Typography>
          </SquishyButton>
          {feedback ? (
            <Typography variant="body" color={COLORS.success} style={styles.feedback}>
              {feedback}
            </Typography>
          ) : null}
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.regular,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    marginBottom: SPACING.xlarge,
    textAlign: 'center',
  },
  formCard: {
    width: '90%',
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  textArea: {
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.regular,
    height: 120,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  button: {
    width: '100%',
  },
  feedback: {
    marginTop: SPACING.regular,
    textAlign: 'center',
  },
});

export default AdminPushComposer;
