import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Image, Switch, ScrollView } from 'react-native';
import { ScreenLayout } from '../../layout';
import { Typography, GlassCard, SquishyButton } from '../../components/ui';
import { supabase, getProfile, upsertProfile } from '../../lib/supabase';
import { setJSON, getJSON } from '../../lib/cache';
import { useAppStore } from '../../state/store';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function ProfileScreen() {
  const isBeta = useAppStore((s) => s.isBeta);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPrivate, setAvatarPrivate] = useState(false);
  const [sarcasm, setSarcasm] = useState(1);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>(['Starter', 'First Repair']);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user?.id || '';
      const prof = await getProfile(user);
      setSarcasm(prof.data?.sarcasm_level || 1);
      const t = await getJSON<string[]>('timeline', []);
      setTimeline(t);
    });
  }, []);

  async function save() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user?.id || '';
    await upsertProfile({ user_id: user, sarcasm_level: sarcasm });
    await setJSON('avatar_private', avatarPrivate);
  }

  async function exportData() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user?.id || '';
    const prof = await getProfile(user);
    const payload = { profile: prof.data, timeline, badges };
    await setJSON('export_profile', payload);
  }

  async function requestDelete() {
    await setJSON('delete_requested', true);
  }

  return (
    <ScreenLayout showHeader={true}>
      <ScrollView style={styles.content}>
        <GlassCard>
          <Typography variant="header">Profile</Typography>
          {isBeta && (
            <View style={styles.betaBadge}>
              <Typography variant="label">Beta Tester</Typography>
            </View>
          )}
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} accessibilityLabel="User Avatar" />
          ) : null}
          <TextInput 
            placeholder="Avatar URL" 
            style={styles.input} 
            value={avatarUrl} 
            onChangeText={setAvatarUrl} 
            accessibilityLabel="Avatar URL Input"
            placeholderTextColor={COLORS.textHint}
          />
          <View style={styles.row}>
            <Typography variant="body">Avatar private</Typography>
            <Switch value={avatarPrivate} onValueChange={setAvatarPrivate} accessibilityLabel="Toggle Avatar Privacy" />
          </View>
          <View style={styles.row}>
            <Typography variant="body">Sarcasm Level</Typography>
            <TextInput 
              style={styles.inputSmall} 
              keyboardType="numeric" 
              value={String(sarcasm)} 
              onChangeText={(v) => setSarcasm(parseInt(v) || 1)} 
              placeholderTextColor={COLORS.textHint}
            />
          </View>
          
          <Typography variant="header" style={{ marginTop: SPACING.large }}>Timeline</Typography>
          {timeline.map((t, i) => (
            <Typography key={i} variant="body">• {t}</Typography>
          ))}
          
          <Typography variant="header" style={{ marginTop: SPACING.large }}>Badges</Typography>
          {badges.map((b, i) => (
            <Typography key={i} variant="label">{b}</Typography>
          ))}
          
          <View style={styles.buttonRow}>
            <SquishyButton onPress={save}>
              <Typography variant="button">Save</Typography>
            </SquishyButton>
            <SquishyButton onPress={exportData} variant="secondary">
              <Typography variant="button">Export</Typography>
            </SquishyButton>
            <SquishyButton onPress={requestDelete} variant="ghost">
              <Typography variant="button">Delete</Typography>
            </SquishyButton>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SPACING.screenPadding,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.regular, 
    color: COLORS.textPrimary, 
    marginTop: SPACING.regular,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: SPACING.regular 
  },
  inputSmall: { 
    backgroundColor: COLORS.backgroundInput, 
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.small, 
    color: COLORS.textPrimary, 
    width: 60 
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.small,
    marginTop: SPACING.large,
  },
  betaBadge: { 
    backgroundColor: COLORS.backgroundInput, 
    padding: SPACING.small, 
    borderRadius: BORDER_RADIUS.small, 
    alignSelf: 'flex-start', 
    marginBottom: SPACING.regular 
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xxlarge,
    marginBottom: SPACING.regular,
  },
});
