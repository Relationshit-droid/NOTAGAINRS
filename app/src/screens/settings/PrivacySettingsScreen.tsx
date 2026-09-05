import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function PrivacySettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [settings, setSettings] = useState({
    profileVisibility: 'partner', // 'partner', 'friends', 'private'
    showOnLeaderboard: true,
    shareGameResults: true,
    shareProgress: true,
    allowDataCollection: true,
    allowAnalytics: true,
    allowPersonalization: true,
    partnerCanSeeHistory: true,
    partnerCanSeeMeters: true,
    partnerCanSeeGames: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchSettings();
  }, [user, userId]);

  const privacySections = [
    {
      title: 'PROFILE VISIBILITY',
      items: [
        { key: 'profileVisibility', label: 'Who can see your profile', type: 'select', options: [
          { value: 'partner', label: 'Partner Only' },
          { value: 'friends', label: 'Partner & Friends' },
          { value: 'private', label: 'Private' },
        ]},
        { key: 'showOnLeaderboard', label: 'Show on Leaderboard', type: 'switch', description: 'Appear in global rankings' },
      ],
    },
    {
      title: 'SHARING WITH PARTNER',
      items: [
        { key: 'partnerCanSeeHistory', label: 'Game History', type: 'switch', description: 'Partner can see your past games' },
        { key: 'partnerCanSeeMeters', label: 'Relationship Meters', type: 'switch', description: 'Partner can see trust, vulnerability, etc.' },
        { key: 'partnerCanSeeGames', label: 'Current Games', type: 'switch', description: 'Partner can see games in progress' },
      ],
    },
    {
      title: 'DATA SHARING',
      items: [
        { key: 'shareGameResults', label: 'Share Game Results', type: 'switch', description: 'Auto-share results with partner after games' },
        { key: 'shareProgress', label: 'Share Progress Updates', type: 'switch', description: 'Share milestone achievements' },
      ],
    },
    {
      title: 'DATA COLLECTION & ANALYTICS',
      items: [
        { key: 'allowDataCollection', label: 'Allow Data Collection', type: 'switch', description: 'Help improve the app with anonymous usage data' },
        { key: 'allowAnalytics', label: 'Analytics Tracking', type: 'switch', description: 'Track feature usage for improvements' },
        { key: 'allowPersonalization', label: 'Personalization', type: 'switch', description: 'Use your data to personalize recommendations' },
      ],
    },
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading privacy settings...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Data Rights Banner */}
        <GlassCard style={styles.bannerCard} variant="elevated">
          <LinearGradient colors={GRADIENTS.primary.colors} style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.textPrimary} />
          </LinearGradient>
          <View>
            <Typography variant="label" style={styles.bannerTitle}>YOUR DATA RIGHTS</Typography>
            <Typography variant="caption" style={styles.bannerText}>
              You control your data. Export, delete, or modify anytime.
            </Typography>
          </View>
        </GlassCard>

        <View style={styles.dataRightsButtons}>
          <SquishyButton variant="secondary" onPress={() => Alert.alert('Export Data', 'Your data export will be prepared and sent to your email.')} style={styles.dataRightButton}>
            <Ionicons name="download" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">EXPORT MY DATA</Typography>
          </SquishyButton>
          <SquishyButton variant="ghost" onPress={() => Alert.alert('Delete Account', 'This will permanently delete all your data. This action cannot be undone.', [{ text: 'Cancel' }, { text: 'Delete', onPress: () => {} }])} style={styles.dataRightButtonDanger}>
            <Ionicons name="trash" size={18} color={COLORS.error} style={{ marginRight: SPACING.small }} />
            <Typography variant="button" color={COLORS.error}>DELETE ACCOUNT</Typography>
          </SquishyButton>
        </View>

        {/* Privacy Sections */}
        {privacySections.map((section, sectionIndex) => (
          <GlassCard key={section.title} style={styles.sectionCard}>
            <Typography variant="label" style={styles.sectionTitle}>{section.title}</Typography>
            
            {section.items.map((item, itemIndex) => (
              <View key={item.key} style={[
                styles.privacyItem,
                itemIndex === section.items.length - 1 ? styles.privacyItemLast : {},
              ]}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemText}>
                    <Typography variant="label" style={styles.itemLabel}>{item.label}</Typography>
                    {item.description && <Typography variant="caption" style={styles.itemDescription}>{item.description}</Typography>}
                  </View>
                </View>
                {item.type === 'switch' && (
                  <Switch
                    value={settings[item.key]}
                    onValueChange={value => updateSetting(item.key, value)}
                    thumbColor={settings[item.key] ? COLORS.vibrantPink : COLORS.textHint}
                    trackColor={{ false: COLORS.borderSubtle, true: COLORS.vibrantPink + '40' }}
                  />
                )}
                {item.type === 'select' && (
                  <TouchableOpacity style={styles.selectButton}>
                    <Typography variant="body" style={styles.selectValue}>
                      {item.options.find((o: any) => o.value === settings[item.key])?.label || 'Select'}
                    </Typography>
                    <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </GlassCard>
        ))}

        {/* Legal Links */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>LEGAL & COMPLIANCE</Typography>
          
          <TouchableOpacity style={styles.legalLink} onPress={() => {}}>
            <Ionicons name="document-text" size={20} color={COLORS.textSecondary} style={styles.legalIcon} />
            <Typography variant="body" style={styles.legalText}>Privacy Policy</Typography>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.legalLink, styles.legalLinkLast]} onPress={() => {}}>
            <Ionicons name="document-text" size={20} color={COLORS.textSecondary} style={styles.legalIcon} />
            <Typography variant="body" style={styles.legalText}>Terms of Service</Typography>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.legalLink, styles.legalLinkLast]} onPress={() => {}}>
            <Ionicons name="document-text" size={20} color={COLORS.textSecondary} style={styles.legalIcon} />
            <Typography variant="body" style={styles.legalText}>Data Processing Agreement</Typography>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textHint} />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  bannerCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  bannerTitle: {
    color: COLORS.vibrantPink,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.tiny,
  },
  bannerText: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  dataRightsButtons: {
    flexDirection: 'row',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  dataRightButton: {
    flex: 1,
  },
  dataRightButtonDanger: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  sectionCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  privacyItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  itemLeft: {
    flex: 1,
  },
  itemText: {
    flex: 1,
  },
  itemLabel: {
    marginBottom: SPACING.tiny,
  },
  itemDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  selectButton: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  selectValue: {
    color: COLORS.textPrimary,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    gap: SPACING.regular,
  },
  legalLinkLast: {
    borderBottomWidth: 0,
  },
  legalIcon: {
    width: 28,
    textAlign: 'center',
  },
  legalText: {
    flex: 1,
    color: COLORS.textPrimary,
  },
});