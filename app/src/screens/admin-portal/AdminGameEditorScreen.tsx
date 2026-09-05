
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminGameEditorScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { game } = route.params;
  const [title, setTitle] = useState(game.title);
  const [instructions, setInstructions] = useState(game.instructions);
  const [gradingKeys, setGradingKeys] = useState(JSON.stringify(game.grading_keys, null, 2));

  const handleSave = async () => {
    const gameRef = doc(db, 'game_library', game.id);
    try {
      await updateDoc(gameRef, {
        title,
        instructions,
        grading_keys: JSON.parse(gradingKeys),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../../assets/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          Edit Game
        </Typography>
        <GlassCard padding="medium" style={styles.formCard}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={COLORS.textHint}
          />
          <TextInput
            style={styles.textArea}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Instructions"
            placeholderTextColor={COLORS.textHint}
            multiline
          />
          <TextInput
            style={styles.textArea}
            value={gradingKeys}
            onChangeText={setGradingKeys}
            placeholder="Grading Keys (JSON)"
            placeholderTextColor={COLORS.textHint}
            multiline
          />
        </GlassCard>
        <SquishyButton
          onPress={handleSave}
          accessibilityLabel="Save game"
          variant="primary"
          size="medium"
          style={styles.button}
        >
          <Typography variant="button" color={COLORS.textPrimary}>
            Save
          </Typography>
        </SquishyButton>
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.healingHospital,
    padding: SPACING.regular,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: COLORS.emotionalConnection,
    marginBottom: SPACING.large,
  },
  formCard: {
    marginBottom: SPACING.regular,
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.input,
    marginBottom: SPACING.regular,
    color: COLORS.textPrimary,
    fontFamily: 'Cheese-Regular',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  textArea: {
    backgroundColor: COLORS.backgroundInput,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.input,
    marginBottom: SPACING.regular,
    height: 150,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    fontFamily: 'Cheese-Regular',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  button: {
    marginBottom: SPACING.xlarge,
  },
});

export default AdminGameEditorScreen;
