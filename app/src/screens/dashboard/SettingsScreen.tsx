import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, ActivityIndicator, Alert } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../lib/api';
import { MARCIE_QUOTES } from '../../constants/marcieQuotes';

const SARCASM_LEVELS = [
  { level: 1, name: "Tough Love Rookie", description: "Straight-talking aunt who doesn't sugarcoat." },
  { level: 2, name: "Reality Check Specialist", description: "Clinical sarcasm with scientific detachment." },
  { level: 3, name: "Radical Truth Wizard", description: "Deep, poetic truth. No BS. Searing but gentle." },
  { level: 4, name: "The Glamour Oracle", description: "Noir Prophecy Mode - Maya Angelou meets Joan Rivers." }
];

export default function SettingsScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [themeSetting, setThemeSetting] = useState('dark');
  const [sarcasmLevel, setSarcasmLevel] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load current user settings if available
    const loadSettings = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userData = await userApi.get(user.uid, token);
          setSarcasmLevel(userData.sarcasm_level || 1);
        } catch (error) {
          console.error("Failed to load user settings:", error);
        }
      }
    };
    loadSettings();
  }, [user]);

  const updateSarcasmLevel = async (level: number) => {
    if (!user || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const token = await user.getIdToken();
      await userApi.updateSarcasm(user.uid, level, token);
      setSarcasmLevel(level);
      Alert.alert("Success", `Dr. Marcie is now in ${SARCASM_LEVELS.find(l => l.level === level)?.name} mode.`);
    } catch (error: any) {
      console.error("Failed to update sarcasm level:", error);
      Alert.alert("Error", "Failed to update Dr. Marcie's personality.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('LoginAndSignUp');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ScreenLayout 
      showHeader={true}
      showMarcie={true}
      marcieAnimation="settings"
      marcieQuote={MARCIE_QUOTES.settings}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="header" style={styles.title}>SETTINGS</Typography>
          <Typography variant="body" style={styles.subtitle}>Customize your experience</Typography>
        </View>

        <GlassCard>
          <Typography variant="label" style={styles.sectionTitle}>APPEARANCE</Typography>
          <View style={styles.settingItem}>
            <Typography variant="body">Theme</Typography>
            <View style={styles.pickerContainer}>
              {['Dark', 'Light', 'Noir'].map((option) => (
                <SquishyButton
                  key={option}
                  onPress={() => setThemeSetting(option.toLowerCase())}
                  variant={themeSetting === option.toLowerCase() ? 'primary' : 'ghost'}
                  size="small"
                >
                  <Typography variant="caption" style={themeSetting === option.toLowerCase() ? styles.selectedPickerText : {}}>
                    {option}
                  </Typography>
                </SquishyButton>
              ))}
            </View>
          </View>
          <View style={styles.settingItem}>
            <Typography variant="body">High Contrast</Typography>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: COLORS.backgroundInput, true: COLORS.vibrantPink }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
          <View style={styles.settingItem}>
            <Typography variant="body">Reduce Motion</Typography>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: COLORS.backgroundInput, true: COLORS.vibrantPink }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
        </GlassCard>

        <GlassCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.regular }}>
            <Typography variant="label" style={styles.sectionTitle}>DR. MARCIE'S PERSONALITY</Typography>
            {isUpdating && <ActivityIndicator size="small" color={COLORS.vibrantPink} />}
          </View>
          
          <Typography variant="caption" style={{ color: COLORS.textSecondary, marginBottom: SPACING.regular }}>
            Adjust how blunt or poetic Dr. Marcie should be with your relationship insights.
          </Typography>

          {SARCASM_LEVELS.map((config) => (
            <SquishyButton
              key={config.level}
              onPress={() => updateSarcasmLevel(config.level)}
              variant={sarcasmLevel === config.level ? 'primary' : 'secondary'}
              style={styles.personalityButton}
              disabled={isUpdating}
            >
              <View style={styles.personalityContent}>
                <Typography variant="h3" style={sarcasmLevel === config.level ? styles.selectedText : {}}>
                  Level {config.level}: {config.name}
                </Typography>
                <Typography variant="caption" style={[styles.personalityDesc, sarcasmLevel === config.level ? styles.selectedText : {}]}>
                  {config.description}
                </Typography>
              </View>
            </SquishyButton>
          ))}
        </GlassCard>

        <GlassCard>
          <Typography variant="label" style={styles.sectionTitle}>ACCOUNT</Typography>
          <SquishyButton onPress={handleLogout} variant="ghost" style={{ borderColor: COLORS.error, borderWidth: 1 }}>
            <Typography variant="button" style={{ color: COLORS.error }}>LOG OUT</Typography>
          </SquishyButton>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  title: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    marginBottom: SPACING.regular,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  selectedPickerText: {
    color: COLORS.textPrimary,
  },
  personalityButton: {
    marginBottom: SPACING.small,
    alignItems: 'flex-start',
    padding: SPACING.regular,
  },
  personalityContent: {
    width: '100%',
  },
  personalityDesc: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  selectedText: {
    color: COLORS.textPrimary,
  },
});
