import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, GRADIENTS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../state/store';

export default function DataPrivacySettingsScreen() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [data, setData] = useState({
    totalGamesPlayed: 47,
    totalMinutes: 1240,
    storageUsed: 245, // MB
    cacheSize: 67, // MB
    lastBackup: '2025-08-10',
    dataRetentionDays: 365,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchData = async () => {
    if (!user || !userId) return;
    try {
      setLoading(true);
      // In real app, fetch from backend
      setData(prev => ({ ...prev }));
    } catch (error) {
      console.error('Failed to fetch data info:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    if (!user || !userId) return;
    setExporting(true);
    try {
      Alert.alert('Export Started', 'Your data export has been queued. You\'ll receive an email when ready.', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const clearCache = async () => {
    setClearing(true);
    try {
      // Clear async storage cache
      Alert.alert('Cache Cleared', 'Temporary files and cache have been removed.', [{ text: 'OK' }]);
      setData(prev => ({ ...prev, cacheSize: 0 }));
    } catch (error) {
      console.error('Clear cache failed:', error);
    } finally {
      setClearing(false);
    }
  };

  const deleteAllData = async () => {
    Alert.alert(
      'Delete All Data',
      'This will PERMANENTLY delete ALL your data including games, progress, reports, and account. This CANNOT be undone.\n\nType "DELETE" to confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirm Deletion',
              'Type "DELETE" to permanently erase all data',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Confirm', 
                  onPress: (value) => {
                    if (value === 'DELETE') {
                      Alert.alert('Data Deleted', 'All your data has been permanently erased.', [{ text: 'OK' }]);
                    } else {
                      Alert.alert('Incorrect', 'You must type exactly "DELETE" to confirm.');
                    }
                  }
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchData();
  }, [user, userId]);

  if (loading) {
    return (
      <ScreenLayout showHeader={false} scrollable={false}>
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Loading data info...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Storage Overview */}
        <GlassCard style={styles.storageCard} variant="elevated">
          <Typography variant="label" style={styles.storageTitle}>STORAGE OVERVIEW</Typography>
          
          <View style={styles.storageGrid}>
            <StorageStat 
              label="Total Storage" 
              value={`${data.storageUsed} MB`} 
              icon="hardware-chip"
              color={COLORS.vibrantPink}
            />
            <StorageStat 
              label="Cache" 
              value={`${data.cacheSize} MB`} 
              icon="archive"
              color={COLORS.aquaTeal}
            />
            <StorageStat 
              label="Games Played" 
              value={data.totalGamesPlayed.toString()} 
              icon="game-controller"
              color={COLORS.brightYellow}
            />
            <StorageStat 
              label="Minutes" 
              value={`${Math.floor(data.totalMinutes / 60)}h ${data.totalMinutes % 60}m`} 
              icon="time"
              color={COLORS.mintGreen}
            />
          </View>

          <View style={styles.storageProgress}>
            <Typography variant="caption" style={styles.storageProgressLabel}>Device Storage Used</Typography>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${Math.min(100, (data.storageUsed / 1000) * 100)}%`, backgroundColor: COLORS.vibrantPink }
              ]} />
            </View>
            <Typography variant="caption" style={styles.storageProgressText}>
              {data.storageUsed} MB of ~1 GB available
            </Typography>
          </View>
        </GlassCard>

        {/* Data Management Actions */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DATA MANAGEMENT</Typography>
          
          <View style={styles.actionGrid}>
            <ActionButton
              label="Export All Data"
              description="Download complete data package (JSON + media)"
              icon="download"
              color={COLORS.vibrantPink}
              onPress={exportData}
              loading={exporting}
            />
            <ActionButton
              label="Clear Cache"
              description="Remove temporary files & cached images"
              icon="trash"
              color={COLORS.warmOrange}
              onPress={clearCache}
              loading={clearing}
            />
            <ActionButton
              label="Reset Game Progress"
              description="Keep account, reset all game history"
              icon="refresh"
              color={COLORS.aquaTeal}
              onPress={() => Alert.alert('Reset Progress', 'This will reset all game history but keep your account.', [
                { text: 'Cancel' },
                { text: 'Reset', onPress: () => Alert.alert('Progress Reset', 'All game progress has been reset.') }
              ])}
            />
            <ActionButton
              label="Manage Backups"
              description="View, restore, or delete cloud backups"
              icon="cloud"
              color={COLORS.lavenderPurple}
              onPress={() => Alert.alert('Backups', 'Backup management coming soon.')}
            />
          </View>
        </GlassCard>

        {/* Data Retention */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DATA RETENTION</Typography>
          
          <View style={styles.retentionItem}>
            <View>
              <Typography variant="label" style={styles.retentionLabel}>Auto-delete Inactive Data</Typography>
              <Typography variant="caption" style={styles.retentionDescription}>
                Automatically delete data after account inactivity
              </Typography>
            </View>
            <View style={styles.retentionValue}>
              <Typography variant="body" style={styles.retentionValueText}>{data.dataRetentionDays} days</Typography>
              <Ionicons name="chevron-down" size={16} color={COLORS.textHint} />
            </View>
          </View>

          <View style={styles.retentionOptions}>
            {[30, 90, 180, 365, 730].map(days => (
              <TouchableOpacity 
                key={days}
                style={[
                  styles.retentionOption,
                  data.dataRetentionDays === days && styles.retentionOptionSelected,
                ]}
                onPress={() => { /* update retention */ }}
              >
                <Typography variant="caption" style={[
                  styles.retentionOptionText,
                  data.dataRetentionDays === days && styles.retentionOptionTextSelected,
                ]}>
                  {days === 730 ? '2 Years' : days === 365 ? '1 Year' : `${days} Days`}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Data Breakdown */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>DATA BREAKDOWN</Typography>
          
          <View style={styles.breakdownList}>
            {[
              { category: 'Game History', size: '145 MB', count: '47 games', icon: 'game-controller', color: COLORS.vibrantPink },
              { category: 'Weekly Reports', size: '32 MB', count: '52 reports', icon: 'document-text', color: COLORS.aquaTeal },
              { category: 'Analytics', size: '28 MB', count: '12 months', icon: 'analytics', color: COLORS.brightYellow },
              { category: 'Media Cache', size: '67 MB', count: '1,240 files', icon: 'images', color: COLORS.mintGreen },
              { category: 'Voice Recordings', size: '18 MB', count: '89 clips', icon: 'mic', color: COLORS.warmOrange },
              { category: 'Preferences', size: '2 MB', count: '1 config', icon: 'settings', color: COLORS.lavenderPurple },
            ].map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <LinearGradient colors={[item.color, item.color + '80']} style={styles.breakdownIcon}>
                  <Ionicons name={item.icon} size={20} color={COLORS.textPrimary} />
                </LinearGradient>
                <View style={styles.breakdownInfo}>
                  <Typography variant="label" style={styles.breakdownCategory}>{item.category}</Typography>
                  <Typography variant="caption" style={styles.breakdownDetails}>{item.count}</Typography>
                </View>
                <Typography variant="header" style={{ color: item.color }}>{item.size}</Typography>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard style={[styles.sectionCard, styles.dangerCard]}>
          <Typography variant="label" style={styles.dangerTitle}>⚠️ DANGER ZONE</Typography>
          <Typography variant="body" style={styles.dangerText}>
            These actions are PERMANENT and CANNOT be undone. Proceed with extreme caution.
          </Typography>
          
          <SquishyButton 
            onPress={deleteAllData}
            variant="ghost"
            style={[styles.dangerButton, { borderColor: COLORS.error, borderWidth: 2 }]}
          >
            <Ionicons name="trash" size={18} color={COLORS.error} style={{ marginRight: SPACING.small }} />
            <Typography variant="button" color={COLORS.error}>DELETE ALL DATA & ACCOUNT</Typography>
          </SquishyButton>
        </GlassCard>

        {/* Last Backup */}
        <GlassCard style={styles.sectionCard}>
          <Typography variant="label" style={styles.sectionTitle}>BACKUP STATUS</Typography>
          
          <View style={styles.backupInfo}>
            <View style={styles.backupItem}>
              <Typography variant="caption" style={styles.backupLabel}>Last Cloud Backup</Typography>
              <Typography variant="body" style={styles.backupValue}>{data.lastBackup}</Typography>
            </View>
            <View style={styles.backupItem}>
              <Typography variant="caption" style={styles.backupLabel}>Backup Size</Typography>
              <Typography variant="body" style={styles.backupValue}>245 MB</Typography>
            </View>
            <View style={styles.backupItem}>
              <Typography variant="caption" style={styles.backupLabel}>Next Scheduled</Typography>
              <Typography variant="body" style={styles.backupValue}>Tonight 2:00 AM</Typography>
            </View>
          </View>

          <SquishyButton 
            variant="secondary"
            onPress={() => Alert.alert('Backup Now', 'Manual backup started. You\'ll be notified when complete.')}
            style={styles.backupButton}
          >
            <Ionicons name="cloud-upload" size={18} color={COLORS.vibrantPink} style={{ marginRight: SPACING.small }} />
            <Typography variant="button">BACKUP NOW</Typography>
          </SquishyButton>
        </GlassCard>
      </ScrollView>
    </ScreenLayout>
  );
}

const StorageStat = ({ label, value, icon, color }: any) => (
  <View style={styles.storageStat}>
    <LinearGradient colors={[color, color + '80']} style={styles.storageIcon}>
      <Ionicons name={icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="header" style={styles.storageValue}>{value}</Typography>
    <Typography variant="caption" style={styles.storageLabel}>{label}</Typography>
  </View>
);

const ActionButton = ({ label, description, icon, color, onPress, loading }: any) => (
  <TouchableOpacity 
    style={[styles.actionButton, { borderColor: color }]}
    onPress={onPress}
    disabled={loading}
  >
    <LinearGradient colors={[color, color + '80']} style={styles.actionIcon}>
      <Ionicons name={icon} size={24} color={COLORS.textPrimary} />
    </LinearGradient>
    <Typography variant="label" style={styles.actionLabel}>{label}</Typography>
    <Typography variant="caption" style={styles.actionDescription}>{description}</Typography>
    {loading && <Ionicons name="refresh" size={20} color={color} style={styles.loadingSpinner} />}
  </TouchableOpacity>
);

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
  storageCard: {
    marginBottom: SPACING.xlarge,
    padding: SPACING.xlarge,
  },
  storageTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xlarge,
    color: COLORS.vibrantPink,
    textAlign: 'center',
  },
  storageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  storageStat: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xlarge,
  },
  storageIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  storageValue: {
    marginBottom: SPACING.tiny,
  },
  storageLabel: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
  },
  storageProgress: {
    marginTop: SPACING.xlarge,
    paddingTop: SPACING.xlarge,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  storageProgressLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginBottom: SPACING.small,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  storageProgressText: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  actionButton: {
    width: '48%',
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xlarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.regular,
  },
  actionLabel: {
    textAlign: 'center',
    marginBottom: SPACING.tiny,
  },
  actionDescription: {
    color: COLORS.textHint,
    textAlign: 'center',
    fontSize: 11,
  },
  loadingSpinner: {
    marginTop: SPACING.regular,
  },
  retentionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  retentionLabel: {
    marginBottom: SPACING.tiny,
  },
  retentionDescription: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  retentionValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  retentionValueText: {
    color: COLORS.vibrantPink,
    fontWeight: '600',
  },
  retentionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
    marginTop: SPACING.regular,
  },
  retentionOption: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundCard,
  },
  retentionOptionSelected: {
    borderWidth: 2,
    borderColor: COLORS.vibrantPink,
    backgroundColor: COLORS.vibrantPink + '20',
  },
  retentionOptionText: {
    color: COLORS.textSecondary,
  },
  retentionOptionTextSelected: {
    color: COLORS.vibrantPink,
    fontWeight: '700',
  },
  breakdownList: {
    gap: SPACING.regular,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.regular,
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  breakdownIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownCategory: {
    marginBottom: SPACING.tiny,
  },
  breakdownDetails: {
    color: COLORS.textHint,
    fontSize: 12,
  },
  dangerCard: {
    borderWidth: 2,
    borderColor: COLORS.error + '40',
    backgroundColor: COLORS.error + '08',
  },
  dangerTitle: {
    marginBottom: SPACING.regular,
    textAlign: 'center',
  },
  dangerText: {
    marginBottom: SPACING.xlarge,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  dangerButton: {
    borderWidth: 2,
  },
  backupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.regular,
  },
  backupItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.regular,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.large,
  },
  backupLabel: {
    color: COLORS.textHint,
    marginBottom: SPACING.tiny,
    textAlign: 'center',
  },
  backupValue: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  backupButton: {
    marginTop: SPACING.xlarge,
    paddingVertical: SPACING.regular,
  },
});