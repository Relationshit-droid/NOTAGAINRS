
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GlobalMarcieOverlay } from '../../components/GlobalMarcieOverlay';
import { functions } from '../../services/firebase';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const AdminGlobalConfiguration = () => {
  const handleSaveChanges = async () => {
    try {
      const saveConfig = functions.httpsCallable('saveConfig');
      await saveConfig({ sass_level: 'high' });
      console.log('Configuration saved.');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <ScreenLayout scrollable={false} showHeader={false}>
      <View style={styles.container}>
        <Typography variant="header" style={styles.title}>Admin Global Configuration</Typography>
        <SquishyButton onPress={handleSaveChanges}>
          <Typography variant="button">Save Changes</Typography>
        </SquishyButton>
        <GlobalMarcieOverlay />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: TYPOGRAPHY.fontSize.displaySmall,
    marginBottom: SPACING.large,
  },
});

export default AdminGlobalConfiguration;
