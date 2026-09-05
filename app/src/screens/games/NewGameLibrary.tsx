import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, ImageBackground } from 'react-native';
import { ScreenLayout, GlassCard, SquishyButton, Typography } from '../../components/ui';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../../lib/supabase';
import { MarcieHost } from '../../components/ai-host';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../theme';

const ALL_GAMES: Game[] = [
    { id: '1', name: 'Lie Detector: Lite™', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Async voice response + AI prosody analysis', mechanics: 'Partner records ≤10-sec answer. Marcie measures fluency, vocal steadiness.', marcieIntro: 'Ooh—24/25. Only slipped on 'uh' once.' },
    { id: '2', name: 'Transparency Toss', category: 'conflict', difficulty: 'Easy', xp: 50, description: 'Real-time text relay', mechanics: 'Each "toss" = low-stakes truth. Partner must tap ✅ to verify.', marcieIntro: 'You tossed 'I scrolled TikTok while you talked'… and they confirmed? Bold.' },
    { id: '3', name: 'Boundary Bingo', category: 'conflict', difficulty: 'Medium', xp: 100, description: 'Async shared grid', mechanics: 'Auto-generated 4×4 grid. Mark only after mutual ✅.', marcieIntro: 'BINGO on 'I asked for space and didn't feel guilty'? Someone upgraded their firmware.' },
    { id: '4', name: 'The Apology Olympics', category: 'conflict', difficulty: 'Hard', xp: 150, description: 'Speed rewrite + AI rubric', mechanics: 'Rewrite "Sorry you felt that way" in <60s. Avoid: but, if, you, however.', marcieIntro: ''I shut down and it made you feel abandoned—I'll pause next time'? Gold and my respect.' },
    { id: '5', name: 'Vibe Sync', category: 'emotional', difficulty: 'Medium', xp: 75, description: 'Synchronous slider', mechanics: 'A sets emotional battery (0–100) → B guesses.', marcieIntro: 'You guessed 68… they're at 69. Psychic or just that in love?' },
];


export default function NewGameLibrary({ navigation }: any) {
  const [games, setGames] = useState<Game[]>(ALL_GAMES);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...games];
    if (cat !== 'all') {
      list = list.filter((g) => g.category.toLowerCase() === cat.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    return list;
  }, [games, cat, search]);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2mvjLAlTkLBW6D1eAUM0_bh2_Onn0TXmy_xLxCfZi4J5tFOBsatN7uoTmlFEJoCL3TmXoy5vd_OJa_LaNLwnXk5r-G-4CW4CTVw0uRf7vY08JuNxxzcEfxQM1-55jZXAdY-Akry-e3wYNgYWHfDJ1aehH7fGTFugOK_l-zzz-2kypLf6NBtBJrYzQj32sLhc2G31ofrKNKzM29sl54-jiP-7asfjUgb_LBWKrDTRqoZtjBIv_vhG_6ex5MpmiYsLVOEnSDcs34GyZ' }}
        style={styles.cosmicBg}
      >
        <SquishyButton 
          onPress={() => navigation.navigate('AdminPortal')} 
          variant="secondary"
          size="small"
        >
          <Typography variant="button">Admin Portal</Typography>
        </SquishyButton>
        
        <ScrollView contentContainerStyle={styles.gridScroll}>
          <View style={styles.header}>
            <Typography variant="h1" center>The Love Arcade</Typography>
            <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
          </View>
          
          {filtered.map((g, i) => (
            <View key={g.id} style={styles.gameCardWrapper}>
              <SquishyButton onPress={() => {}} style={styles.gameCard}>
                <GlassCard>
                  <Typography variant="h3" style={styles.gameTitle}>{g.name}</Typography>
                  <Typography variant="body" style={styles.gameDescription}>{g.description}</Typography>
                </GlassCard>
              </SquishyButton>
            </View>
          ))}
        </ScrollView>
        <MarcieHost mode={'idle'} size={180} float position={{ x: 0, y: 150 }} />
      </ImageBackground>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  cosmicBg: {
    flex: 1,
  },
  header: {
    marginBottom: SPACING.xlarge,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: SPACING.small,
    color: COLORS.textSecondary,
  },
  gridScroll: { 
    padding: SPACING.screenPadding,
    paddingTop: SPACING.xlarge,
  },
  gameCardWrapper: { 
    width: '100%', 
    marginBottom: SPACING.regular 
  },
  gameCard: {
    padding: SPACING.cardPadding,
  },
  gameTitle: {
    marginBottom: SPACING.small,
    color: COLORS.textPrimary,
  },
  gameDescription: {
    color: COLORS.textSecondary,
  },
});
