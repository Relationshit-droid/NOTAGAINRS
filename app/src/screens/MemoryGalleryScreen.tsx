import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../state/store';

export default function MemoryGalleryScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [memories, setMemories] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'photos' | 'videos' | 'notes' | 'milestones'>('all');
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchMemories = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // In real app, fetch from backend
      const mockMemories = [
        { id: '1', type: 'photo', title: 'First Date', date: '2024-03-15', caption: 'Our first dinner together', thumbnail: null, tags: ['first date', 'restaurant'], favorite: true },
        { id: '2', type: 'milestone', title: '6 Months Together', date: '2024-09-15', caption: 'Half a year of love!', thumbnail: null, tags: ['anniversary', 'celebration'], favorite: true },
        { id: '3', type: 'note', title: 'Love Letter', date: '2024-11-03', caption: 'Handwritten note found in my bag', thumbnail: null, tags: ['surprise', 'romantic'], favorite: false },
        { id: '4', type: 'photo', title: 'Weekend Getaway', date: '2024-12-20', caption: 'Mountains and hot cocoa', thumbnail: null, tags: ['travel', 'winter'], favorite: true },
        { id: '5', type: 'video', title: 'First Kiss', date: '2024-03-18', caption: 'Under the streetlight', thumbnail: null, tags: ['first kiss', 'magical'], favorite: true },
        { id: '6', type: 'milestone', title: '1 Year!', date: '2025-03-15', caption: 'One whole year together', thumbnail: null, tags: ['anniversary', 'year'], favorite: true },
        { id: '7', type: 'photo', title: 'Cooking Together', date: '2025-01-10', caption: 'Burnt pasta but perfect memory', thumbnail: null, tags: ['cooking', 'funny'], favorite: false },
        { id: '8', type: 'note', title: 'Future Dreams', date: '2025-02-14', caption: 'Where we see ourselves in 5 years', thumbnail: null, tags: ['valentine', 'dreams'], favorite: true },
      ];
      setMemories(mockMemories);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter(m => filter === 'all' || m.type === filter);

  const addMemory = () => {
    // In real app, open camera/gallery picker
    Alert.alert('Add Memory', 'Choose memory type:', [
      { text: 'Photo', onPress: () => { /* Open camera */ } },
      { text: 'Video', onPress: () => { /* Open video */ } },
      { text: 'Voice Note', onPress: () => { /* Record audio */ } },
      { text: 'Text Note', onPress: () => { /* Open text input */ } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  useEffect(() => {
    fetchMemories();
  }, [user]);

  const typeIcons = {
    photo: 'image',
    video: 'videocam',
    note: 'create',
    milestone: 'flag',
  };

  const typeColors = {
    photo: COLORS.vibrantPink,
    video: COLORS.warmOrange,
    note: COLORS.aquaTeal,
    milestone: COLORS.brightYellow,
  };

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={[COLORS.rosePink, COLORS.brightYellow]} style={styles.loadingGlow}>
            <Ionicons name="image" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading memories...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const renderMemory = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.memoryCard}
      onPress={() => setSelectedMemory(item)}
    >
      <View style={[
        styles.memoryThumbnail,
        { borderColor: typeColors[item.type] },
      ]}>
        <LinearGradient colors={[typeColors[item.type], typeColors[item.type] + '80']} style={styles.typeBadge}>
          <Ionicons name={typeIcons[item.type]} size={20} color={COLORS.textPrimary} />
        </LinearGradient>
        {item.favorite && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={(e) => { e.stopPropagation(); /* Toggle favorite */ }}
          >
            <Ionicons name="heart" size={18} color={COLORS.rosePink} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.memoryInfo}>
        <Typography variant="label" style={styles.memoryTitle}>{item.title}</Typography>
        <Typography variant="caption" style={styles.memoryDate}>{new Date(item.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
        <Typography variant="caption" style={styles.memoryCaption} numberOfLines={2}>{item.caption}</Typography>
        <View style={styles.memoryTags}>
          {item.tags.slice(0, 3).map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Typography variant="caption" style={styles.tagText}>#{tag}</Typography>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={[COLORS.rosePink, COLORS.brightYellow]} style={styles.loadingGlow}>
            <Ionicons name="image" size={48} color={COLORS.textPrimary} />
          </LinearGradient>
          <Typography variant="body" center style={{ marginTop: SPACING.regular }}>Loading memories...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Stats */}
        <GlassCard style={styles.statsCard} variant="elevated">
          <View style={styles.statsHeader}>
            <Typography variant="label" style={styles.statsTitle}>MEMORY GALLERY</Typography>
            <TouchableOpacity onPress={addMemory} style={styles.addButton}>
              <Ionicons name="add" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <StatItem label="Total Memories" value={memories.length.toString()} color={COLORS.vibrantPink} icon="image" />
            <StatItem label="Photos" value={memories.filter(m => m.type === 'photo').length.toString()} color={COLORS.aquaTeal} icon="image" />
            <StatItem label="Milestones" value={memories.filter(m => m.type === 'milestone').length.toString()} color={COLORS.brightYellow} icon="flag" />
            <StatItem label="Favorites" value={memories.filter(m => m.favorite).length.toString()} color={COLORS.rosePink} icon="heart" />
          </View>
        </GlassCard>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {['all', 'photo', 'video', 'note', 'milestone'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterTab,
                filter === f && styles.filterTabActive,
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Ionicons name={typeIcons[f as keyof typeof typeIcons] || 'grid'} size={16} color={filter === f ? COLORS.textPrimary : COLORS.textHint} style={{ marginRight: 4 }} />
              <Typography variant="caption" style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Memories Grid */}
        <FlatList
          data={filteredMemories}
          renderItem={renderMemory}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.memoriesGrid}
          ItemSeparatorComponent={() => <View style={styles.gridSeparator} />}
        />

        {filteredMemories.length === 0 && (
          <GlassCard style={styles.emptyState}>
            <Ionicons name={filter === 'all' ? 'image' : typeIcons[filter as keyof typeof typeIcons]} size={48} color={COLORS.textHint} />
            <Typography variant="label" style={styles.emptyTitle}>
              {filter === 'all' ? 'NO MEMORIES YET' : `NO ${filter.toUpperCase()}S`}
            </Typography>
            <Typography variant="caption" style={styles.emptySubtitle} center>
              {filter === 'all' ? 'Tap + to add your first memory!' : `No ${filter}s added yet. Tap + to add one.`}
            </Typography>
          </GlassCard>
        )}

        {/* Memory Detail Modal */}
        <Modal visible={!!selectedMemory} animationType="slide" transparent onRequestClose={() => setSelectedMemory(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <LinearGradient colors={[typeColors[selectedMemory?.type], typeColors[selectedMemory?.type] + '80']} style={styles.modalTypeBadge}>
                  <Ionicons name={typeIcons[selectedMemory?.type as keyof typeof typeIcons] || 'image'} size={20} color={COLORS.textPrimary} />
                </LinearGradient>
                <Typography variant="label" style={styles.modalTitle}>{selectedMemory?.title}</Typography>
                <TouchableOpacity onPress={() => setSelectedMemory(null)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Typography variant="caption" style={styles.modalDate}>{new Date(selectedMemory?.date).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>
                <Typography variant="body" style={styles.modalCaption}>{selectedMemory?.caption}</Typography>
                
                <View style={styles.modalTags}>
                  {selectedMemory?.tags.map((tag: string, index: number) => (
                    <View key={index} style={styles.tag}>
                      <Typography variant="caption" style={styles.tagText}>#{tag}</Typography>
                    </View>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <SquishyButton variant="secondary" onPress={() => { /* Edit */ }} style={styles.modalActionButton}>
                    <Typography variant="button">EDIT</Typography>
                  </SquishyButton>
                  <SquishyButton variant="ghost" onPress={() => { /* Share */ }} style={styles.modalActionButton}>
                    <Typography variant="button">SHARE</Typography>
                  </SquishyButton>
                  <SquishyButton onPress={() => Alert.alert('Delete', 'Delete this memory?', [
                    { text: 'Cancel' },
                    { text: 'Delete', onPress: () => { setSelectedMemory(null); /* Delete */ } }
                  ])} style={[styles.modalActionButton, { borderColor: COLORS.error, borderWidth: 2 }]}>
                    <Typography variant="button" color={COLORS.error}>DELETE</Typography>
                  </SquishyButton>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenLayout>
  );
}

const StatItem = ({ label, value, color, icon }: any) => (
  <View style={styles.statItem}>
    <LinearGradient colors={[color, color + '80']} style={styles.statIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.statValue}>{value}</Typography>
    <Typography variant="caption" style={styles.statLabel}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGlow: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.large,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxxlarge,
  },
  statsCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  statsTitle: {
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.vibrantPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginTop: SPACING.xlarge,
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.small,
    marginBottom: SPACING.xlarge,
    flexWrap: 'wrap',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundCard,
  },
  filterTabActive: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '20',
  },
  filterTabText: {
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
  },
  memoriesGrid: {
    paddingHorizontal: SPACING.tiny,
  },
  gridSeparator: {
    height: SPACING.regular,
  },
  memoryCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
  memoryThumbnail: {
    aspectRatio: 1,
    backgroundColor: COLORS.backgroundSecondary,
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: SPACING.regular,
    left: SPACING.regular,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.regular,
    right: SPACING.regular,
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoryInfo: {
    padding: SPACING.regular,
  },
  memoryTitle: {
    marginBottom: SPACING.tiny,
  },
  memoryDate: {
    color: COLORS.textHint,
    fontSize: 11,
    marginBottom: SPACING.regular,
  },
  memoryCaption: {
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.regular,
  },
  memoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.tiny,
  },
  tag: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  emptyState: {
    padding: SPACING.xxxlarge,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: SPACING.large,
    marginBottom: SPACING.small,
    color: COLORS.textHint,
  },
  emptySubtitle: {
    color: COLORS.textHint,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: SPACING.screenPadding,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xxlarge,
    maxHeight: '90%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.xlarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  modalTypeBadge: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: SPACING.small,
  },
  modalBody: {
    padding: SPACING.xlarge,
  },
  modalDate: {
    color: COLORS.textHint,
    marginBottom: SPACING.regular,
  },
  modalCaption: {
    lineHeight: 24,
    marginBottom: SPACING.xlarge,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.tiny,
    marginBottom: SPACING.xlarge,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.regular,
    marginTop: SPACING.xlarge,
  },
  modalActionButton: {
    flex: 1,
  },
});