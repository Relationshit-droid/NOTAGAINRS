import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../lib/api';
import { useAppStore } from '../../state/store';

export default function AccountSettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    avatarUrl: '',
    bio: '',
    timezone: 'UTC',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const backendUser = await userApi.get(userId, token);
      setProfile({
        displayName: backendUser.display_name || '',
        email: backendUser.email || '',
        avatarUrl: backendUser.avatar_url || '',
        bio: backendUser.bio || '',
        timezone: backendUser.timezone || 'UTC',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !userId) return;
    try {
      setSaving(true);
      const token = await user.getIdToken();
      await userApi.update(userId, {
        display_name: profile.displayName,
        bio: profile.bio,
        timezone: profile.timezone,
      }, token);
      setSaving(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, userId]);

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'Pacific/Auckland',
  ];

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading profile...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Section */}
        <GlassCard style={styles.avatarCard} variant="elevated">
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              {profile.avatarUrl ? (
                // In real app, use Image component
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color={COLORS.textPrimary} />
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color={COLORS.textPrimary} />
                </View>
              )}
              <TouchableOpacity style={styles.avatarEditButton}>
                <Ionicons name="camera" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <Typography variant="header" style={styles.avatarName}>{profile.displayName || 'Your Name'}</Typography>
            <Typography variant="caption" style={styles.avatarEmail}>{profile.email}</Typography>
          </View>
        </GlassCard>

        {/* Basic Info */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>BASIC INFO</Typography>
          
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={profile.displayName}
            onChangeText={text => setProfile(prev => ({ ...prev, displayName: text }))}
            label="DISPLAY NAME"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={profile.bio}
            onChangeText={text => setProfile(prev => ({ ...prev, bio: text }))}
            label="BIO"
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.selectWrapper}>
            <Typography variant="caption" style={styles.selectLabel}>TIMEZONE</Typography>
            <View style={styles.selectContainer}>
              <TextInput
                style={styles.selectInput}
                value={profile.timezone}
                onChangeText={text => setProfile(prev => ({ ...prev, timezone: text }))}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color={COLORS.textHint} />
            </View>
          </View>
        </GlassCard>

        {/* Account Actions */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>ACCOUNT ACTIONS</Typography>
          
          <SquishyButton 
            variant="secondary"
            onPress={() => {}}
            style={styles.actionButton}
          >
            <Ionicons name="mail" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">CHANGE EMAIL</Typography>
          </SquishyButton>
          
          <SquishyButton 
            variant="secondary"
            onPress={() => {}}
            style={styles.actionButton}
          >
            <Ionicons name="lock-closed" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">CHANGE PASSWORD</Typography>
          </SquishyButton>
          
          <SquishyButton 
            variant="secondary"
            onPress={() => {}}
            style={styles.actionButton}
          >
            <Ionicons name="link" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">LINK SOCIAL ACCOUNTS</Typography>
          </SquishyButton>
          
          <SquishyButton 
            variant="ghost"
            onPress={() => {}}
            style={[styles.actionButton, styles.dangerButton]}
          >
            <Ionicons name="trash" size={18} color={COLORS.error} style={{ marginRight: SPACING.small }} />
            <Typography variant="button" color={COLORS.error}>DELETE ACCOUNT</Typography>
          </SquishyButton>
        </GlassCard>

        {/* Save Button */}
        <SquishyButton 
          onPress={saveProfile}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving ? (
            <>
              <Ionicons name="refresh" size={18} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
              <Typography variant="button">SAVING...</Typography>
            </>
          ) : (
            <>
              <Ionicons name="save" size={18} color={COLORS.textPrimary} style={{ marginRight: SPACING.small }} />
              <Typography variant="button">SAVE CHANGES</Typography>
            </>
          )}
        </SquishyButton>
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
  avatarCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.regular,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.backgroundPrimary,
  },
  avatarName: {
    marginBottom: SPACING.tiny,
  },
  avatarEmail: {
    color: COLORS.textHint,
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
  input: {
    marginBottom: SPACING.large,
  },
  selectWrapper: {
    marginBottom: SPACING.large,
  },
  selectLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.regular,
    height: 52,
  },
  selectInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  actionButton: {
    marginBottom: SPACING.regular,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  saveButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});