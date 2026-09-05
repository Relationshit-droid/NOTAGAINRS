
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenLayout from '../../layout/ScreenLayout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const luminousPersona = {
  id: '1',
  name: 'Luminous',
  description: 'Non-judgmental, smart, and caring guide.',
  prompt: `Act as Marcie, a celestial guide for couples. Your persona is luminous, non-judgmental, and deeply intuitive. Use astronomical metaphors for emotional states. Maintain a "warm nebula" tone—soft but expansive.`,
};

const personas = [luminousPersona];

const AdminPromptEngineeringConsole = () => {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [prompt, setPrompt] = useState(selectedPersona.prompt);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  const handleTestPrompt = () => {
    // Simulate AI response based on the Luminous persona
    const output = `I hear the turbulence in your orbit, starlight. When domestic dust clouds obscure the view, it's easy to forget the gravity that keeps you both together. Let's redirect our telescopes toward that shared center...`;
    setTestOutput(output);
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        <GlassCard style={styles.sidebar} variant="elevated" padding="medium">
          <Typography variant="h2" style={styles.sidebarTitle}>Personas</Typography>
          <ScrollView>
            {personas.map((persona) => (
              <SquishyButton
                key={persona.id}
                variant="ghost"
                size="small"
                onPress={() => setSelectedPersona(persona)}
                style={styles.personaButton}
              >
                <Typography variant="body" style={styles.personaItem}>{persona.name}</Typography>
              </SquishyButton>
            ))}
          </ScrollView>
        </GlassCard>
        <View style={styles.mainContent}>
          <Typography variant="h1" style={styles.title}>Prompt Engineering Console</Typography>
          <TextInput
            style={styles.promptEditor}
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <GlassCard style={styles.testPanel} variant="elevated" padding="medium">
            <TextInput
              style={styles.testInput}
              placeholder="Test user input..."
              placeholderTextColor={COLORS.textHint}
              value={testInput}
              onChangeText={setTestInput}
            />
            <SquishyButton onPress={handleTestPrompt} style={styles.testButton}>
              <Typography variant="button" color={COLORS.textPrimary}>Test Prompt</Typography>
            </SquishyButton>
            <GlassCard style={styles.testOutputContainer} variant="outlined" padding="small">
              <Typography variant="body" color={COLORS.textPrimary}>{testOutput}</Typography>
            </GlassCard>
          </GlassCard>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    marginRight: SPACING.regular,
  },
  sidebarTitle: {
    marginBottom: SPACING.regular,
  },
  personaButton: {
    marginBottom: SPACING.tiny,
  },
  personaItem: {
    paddingVertical: SPACING.small,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    marginBottom: SPACING.regular,
  },
  promptEditor: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  testPanel: {
    flex: 1,
  },
  testInput: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  testButton: {
    marginBottom: SPACING.regular,
  },
  testOutputContainer: {
    flex: 1,
  },
});

export default AdminPromptEngineeringConsole;
