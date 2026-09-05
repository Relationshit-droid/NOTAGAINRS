import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../state/store';
import { useAccess } from '../../lib/gating';

export default function PreviewOverlay() {
  const previewMode = useAppStore((s) => s.previewMode);
  const { isBlocked, plan, isBeta } = useAccess();

  // If we are simulating a role, show a sticky banner at the top
  const roleText = isBlocked ? 'Blocked' : isBeta ? 'Beta' : plan === 'premium' ? 'Premium' : 'Free';
  const showRoleBadge = useAppStore((s) => s.previewRole) !== null;

  if (!previewMode && !showRoleBadge) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      {showRoleBadge && (
        <View style={styles.roleBadge}>
           <Text style={styles.roleText}>🕶️ Previewing as: {roleText}</Text>
        </View>
      )}
      {previewMode && <Text style={styles.watermark}>BETA PREVIEW</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9999, justifyContent: 'space-between' },
  roleBadge: { backgroundColor: '#E4E831', padding: 8, alignItems: 'center', marginTop: 40, alignSelf: 'center', borderRadius: 8 },
  roleText: { color: '#1a0a1f', fontWeight: 'bold' },
  watermark: { marginBottom: 12, fontSize: 16, letterSpacing: 2, color: 'rgba(250,31,99,0.65)', alignSelf: 'center' }
});

