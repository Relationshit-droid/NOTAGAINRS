import { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, Platform } from 'react-native';
import { Text, SquishyButton } from '../ui';
import { supabase } from '../../lib/supabase';
import { navigationRef } from '../../lib/navigation';
import { ENV } from '../../lib/env';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

export default function FeedbackFab() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  async function submit() {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const route = navigationRef.getCurrentRoute()?.name;
    const ADMIN_BASE = ENV.ADMIN_BASE_URL;
    if (!ADMIN_BASE) return;
    await fetch(`${ADMIN_BASE}/api/feedback/submit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, email: (user as any)?.email, route, priority, message, context: { os: Platform.OS } })
    });
    setMessage('');
    setOpen(false);
  }
  return (
    <>
      <SquishyButton onPress={() => setOpen(true)} style={styles.fab}><Text variant="header">✍️</Text></SquishyButton>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text variant="header">Beta Feedback</Text>
            <TextInput multiline placeholder="What happened?" value={message} onChangeText={setMessage} style={styles.input} placeholderTextColor={COLORS.textHint} />
            <View style={styles.row}>
              {(['low','medium','high','critical'] as const).map((p) => (
                <SquishyButton key={p} style={styles.btn} onPress={() => setPriority(p)}><Text variant="header">{p}</Text></SquishyButton>
              ))}
            </View>
            <View style={styles.row}>
              <SquishyButton style={styles.btn} onPress={() => setOpen(false)}><Text variant="header">Close</Text></SquishyButton>
              <SquishyButton style={styles.btn} onPress={submit}><Text variant="header">Submit</Text></SquishyButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', left: SPACING.large, bottom: SPACING.large, zIndex: 1001, paddingHorizontal: SPACING.regular, paddingVertical: SPACING.small, backgroundColor: COLORS.mintGreen, borderRadius: BORDER_RADIUS.xxlarge },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 10, 12, 0.6)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '88%', backgroundColor: COLORS.backgroundSecondary, borderRadius: BORDER_RADIUS.xlarge, borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)', padding: SPACING.regular },
  input: { minHeight: 120, backgroundColor: COLORS.backgroundPrimary, borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)', borderRadius: BORDER_RADIUS.medium, padding: SPACING.small, color: COLORS.textPrimary, marginTop: SPACING.small },
  row: { flexDirection: 'row', gap: SPACING.medium, justifyContent: 'flex-end', marginTop: SPACING.medium },
  btn: { paddingHorizontal: SPACING.medium, paddingVertical: SPACING.small, backgroundColor: COLORS.healingHospital, borderRadius: BORDER_RADIUS.medium }
});
