
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Slider, Image } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { ScreenLayout } from '../../layout';
import { Typography, SquishyButton, GlassCard } from '../../components/ui';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

const AdminGlobalConfig = () => {
  const [sassLevel, setSassLevel] = useState(0);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'system_config', 'ai_personality');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSassLevel(docSnap.data().sass_level);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, 'system_config', 'ai_personality');
    try {
      await setDoc(docRef, { sass_level: sassLevel }, { merge: true });
    } catch (error) {
      console.error("Error updating config: ", error);
    }
  };

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo/mainlogoone.png')} style={styles.logo} />
        </View>
        <Typography variant="h1" center style={styles.title}>
          Global Config
        </Typography>
        <GlassCard padding="large" style={styles.configCard}>
          <Typography variant="h3" center style={styles.label}>
            Sass Level: {sassLevel.toFixed(1)}
          </Typography>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            value={sassLevel}
            onValueChange={setSassLevel}
            minimumTrackTintColor={COLORS.emotionalConnection}
            maximumTrackTintColor={COLORS.textPrimary}
          />
          <SquishyButton
            onPress={handleSave}
            accessibilityLabel="Save configuration"
            variant="primary"
            size="medium"
            style={styles.button}
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Save
            </Typography>
          </SquishyButton>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.healingHospital,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.regular,
  },
  header: {
    position: 'absolute',
    top: SPACING.xlarge,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    color: COLORS.emotionalConnection,
    marginBottom: SPACING.xlarge,
  },
  configCard: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'SweetPink-Regular',
    color: COLORS.textPrimary,
    marginBottom: SPACING.large,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  button: {
    marginTop: SPACING.xlarge,
  },
});

export default AdminGlobalConfig;
